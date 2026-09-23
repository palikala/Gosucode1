// Prints the full product hierarchy of one Personal Auto policy:
//   Policy -> Line -> line coverages (+ terms) -> vehicles -> vehicle coverages (+ terms)
//          -> drivers -> exclusions / conditions
// Run with: Run in Debug Process

uses gw.api.database.Query
uses gw.api.database.Relop

var policyNumber = "P000143542"

// ---------------------------------------------------------------------------
// 1. Find the latest version of the latest term
// ---------------------------------------------------------------------------
var period = Query.make(PolicyPeriod)
    .compare(PolicyPeriod#PolicyNumber, Relop.Equals, policyNumber)
    .compare(PolicyPeriod#MostRecentModel, Relop.Equals, true)
    .select()
    .toList()
    .sortByDescending(\p -> p.TermNumber)
    .first()

if (period == null) {
  print("Policy " + policyNumber + " not found")
} else {

  // Coverages, vehicles, drivers are effective-dated: read them from a SLICE
  var slice = period.getSlice(period.EditEffectiveDate)

  print("POLICY " + period.PolicyNumber)
  print("  Product    : " + period.Policy.ProductCode)
  print("  Account    : " + period.Policy.Account.AccountNumber)
  print("  Insured    : " + period.PrimaryInsuredName)
  print("  Term/Model : " + period.TermNumber + " / " + period.ModelNumber + "   Status: " + period.Status)
  print("  Period     : " + period.PeriodStart + " -> " + period.PeriodEnd + "   (as of " + period.EditEffectiveDate + ")")

  var paLine = slice.PersonalAutoLine
  if (paLine == null) {
    print("  (no Personal Auto line on this policy)")
  } else {

    // -------------------------------------------------------------------------
    // 2. The line and its LINE-LEVEL coverages
    // -------------------------------------------------------------------------
    print("\n  LINE " + paLine.Pattern.CodeIdentifier)
    var lineCovs = paLine.AllCoverages.where(\c -> c.OwningCoverable typeis PersonalAutoLine)
    print("    Line coverages (" + lineCovs.Count + "):")
    for (cov in lineCovs) {
      printCoverage(cov, "      ")
    }

    // -------------------------------------------------------------------------
    // 3. Vehicles (coverables) and their VEHICLE-LEVEL coverages
    // -------------------------------------------------------------------------
    print("\n    Vehicles (" + paLine.Vehicles.Count + "):")
    for (v in paLine.Vehicles) {
      print("      VEHICLE " + v.Year + " " + v.Make + " " + v.Model + "   VIN=" + v.Vin)
      var vehCovs = paLine.AllCoverages.where(\c -> c.OwningCoverable == v)
      for (cov in vehCovs) {
        printCoverage(cov, "        ")
      }
    }

    // -------------------------------------------------------------------------
    // 4. Drivers (coverables)
    // -------------------------------------------------------------------------
    print("\n    Drivers (" + paLine.PolicyDrivers.Count + "):")
    for (d in paLine.PolicyDrivers) {
      print("      DRIVER " + d.DisplayName)
    }

    // -------------------------------------------------------------------------
    // 5. Exclusions and conditions
    // -------------------------------------------------------------------------
    print("\n    Exclusions (" + paLine.AllExclusions.Count + "):")
    for (ex in paLine.AllExclusions) {
      print("      " + ex.Pattern.CodeIdentifier + "  (" + ex.Pattern.Name + ")  on " + ex.OwningCoverable.DisplayName)
    }

    print("\n    Conditions (" + paLine.AllConditions.Count + "):")
    for (cond in paLine.AllConditions) {
      print("      " + cond.Pattern.CodeIdentifier + "  (" + cond.Pattern.Name + ")  on " + cond.OwningCoverable.DisplayName)
    }
  }
}

// ---------------------------------------------------------------------------
// Prints one coverage row, its pattern code (link to the product model),
// and each coverage term with its value
// ---------------------------------------------------------------------------
function printCoverage(cov : Coverage, indent : String) {
  print(indent + "COVERAGE " + cov.Pattern.CodeIdentifier + "  (" + cov.Pattern.Name + ")")
  for (term in cov.CovTerms) {
    print(indent + "    term " + term.Pattern.CodeIdentifier + " = " + term.DisplayValue)
  }
}
