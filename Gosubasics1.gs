uses gw.api.database.Query
uses gw.api.database.Relop

// ---------------------------------------------------------------------------
// Get one row to work with: the latest version of a policy
// ---------------------------------------------------------------------------
var policyNumber = "2483740880"
print("--------------------")

var p1 = Query.make(PolicyPeriod)
print(p1)
print(statictypeof(p1))
print(typeof(p1))


print("--------------------")

var p2 = Query.make(PolicyPeriod)
    .compare(PolicyPeriod#PolicyNumber, Relop.Equals, policyNumber)
print(p2)
print(statictypeof(p2))
print(typeof(p2))
