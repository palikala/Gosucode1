uses gw.api.productmodel.ProductLookup

var product = ProductLookup.getAll().firstWhere(\p -> p.CodeIdentifier == "PersonalAuto")

for (line in product.LinePatterns) {
  print("Line: " + line.CodeIdentifier)
  for (category in line.CoverageCategories) {
    for (ex in category.ExclusionPatterns) {
      print("  EXCLUSION " + ex.CodeIdentifier + "  (" + ex.Name + ")   category: " + category.Name)
    }
    for (cond in category.ConditionPatterns) {
      print("  CONDITION " + cond.CodeIdentifier + "  (" + cond.Name + ")   category: " + category.Name)
    }
  }
}
