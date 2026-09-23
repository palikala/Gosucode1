
uses gw.api.productmodel.ProductLookup

var products = ProductLookup.getAll()

print("Products: " + products.Count)
for (p in products) {
print("  " + p.CodeIdentifier + "  →  " + p.Name)
}
