# JTL ERP GraphQL Schema - Complete Reference

This document shows ALL available data from JTL ERP GraphQL API.

**Simple Structure:**
```
DOMAIN (e.g., Sales, Products, Customers)
  └── QUERY (how you fetch data, e.g., QuerySalesOrders)
        └── FIELDS (what data you get back, e.g., salesOrderNumber, totalGrossAmount)
```

---

# 1. SALES

## QuerySalesOrders
Fetch sales orders (Kundenaufträge)

**Fields:**
- id
- salesOrderNumber
- salesOrderDate
- customerId
- customerNumber
- companyName
- totalGrossAmount
- totalNetAmount
- currencyIso
- paymentStatus
- deliveryStatus
- isPending
- isCancelled
- shippingMethodId
- shippingMethodName
- paymentMethodId
- paymentMethodName
- languageIso
- vatId
- companyId
- processColourId
- onHoldReasonId

**Nested - billingAddress:**
- companyName
- salutation
- title
- firstName
- lastName
- street
- additionalAddressLine
- postalCode
- city
- countryName
- countryIso
- state
- phoneNumber
- mobilePhoneNumber
- faxNumber
- emailAddress

**Nested - shipmentAddress:**
- companyName
- salutation
- title
- firstName
- lastName
- street
- additionalAddressLine
- postalCode
- city
- countryName
- countryIso
- state
- phoneNumber
- mobilePhoneNumber
- faxNumber
- emailAddress

**Nested - lineItems:**
- id
- salesOrderId
- itemId
- sku
- isReserved
- name
- fnSku
- type
- quantity
- salesUnit
- salesPriceNet
- discountPercent
- purchasePriceNet
- taxRate
- taxClassId
- taxCodeId
- note
- totalSalesPriceNet
- totalSalesPriceGross
- sortOrder
- configurationItemType
- billOfMaterialsType
- standardName
- hasUpload

**Example Query:**
```graphql
query {
  QuerySalesOrders(first: 10, order: [{ salesOrderDate: DESC }]) {
    totalCount
    nodes {
      salesOrderNumber
      salesOrderDate
      totalGrossAmount
      companyName
      paymentStatus
    }
  }
}
```

---

## QuerySalesQuotations
Fetch sales quotations/offers (Angebote)

**Fields:**
- id
- salesQuotationNumber
- salesQuotationDate
- customerId
- isPending
- isCancelled
- salesQuotationStatus
- paymentMethodId
- shippingMethodId
- languageIso
- vatId
- companyId
- billingAddress (same as SalesOrder)
- shipmentAddress (same as SalesOrder)
- lineItems (same structure as SalesOrder)

---

## GetSalesOrderById
Fetch single sales order by ID

**Parameters:** id (required)

**Fields:** Same as QuerySalesOrders

---

# 2. PRODUCTS / ITEMS

## QueryItems
Fetch products/items (Artikel)

**Fields:**
- id
- sku
- name
- unit
- description
- shortDescription
- notes
- labels
- series
- gtin
- manufacturerNumber
- isbn
- defaultAsin
- taricCode
- upc
- unNumber
- hazardNumber
- amazonFnsku
- jfsku
- countryOfOrigin
- manufacturerName
- deliveryStatus
- isDeliveryTimeAutomatic
- manualDeliveryTimeDays
- width
- height
- length
- shippingWeight
- weight
- createdDate
- modifiedDate
- modifiedTimestamp
- releaseDate
- lastPurchaseDate
- lastEditor
- salesPriceNet
- salesPriceGross
- suggestedRetailPrice
- averagePurchasePriceNet
- lastPurchasePrice
- amazonPrice
- ebayPrice
- profit
- profitPercent
- specialPriceStatus
- basePriceValue
- basePriceUnit
- measurementUnit
- stockTotal
- stockOwn
- stockIncoming
- stockOnPurchaseList
- stockInOrders
- stockAvailable
- stockReservedTotal
- stockInAmazonOffers
- ebayStock
- minimumOrderQuantity
- purchaseInterval
- buffer
- minimumStock
- allowNegativeStock
- isInventoryManagementActive
- isDivisible
- hasBatch
- hasBestBeforeDate
- isSerialNumberManaged
- serialNumberTrackingMode
- isActive
- isOnPriceList
- isTopItem
- isNew
- isBillOfMaterials
- isBillOfMaterialsComponent
- isVariationParent
- isVariationChild
- hasMinimumStock
- isBlockedForOrderSuggestions
- isShopActive
- isOrderProcessProhibited
- salesPackagingUnit
- conditionId
- conditionName
- isFulfillmentActive
- isFulfillmentOwn
- taxClassId
- taxClassName
- manufacturerId
- productGroupId
- productGroupName
- defaultSupplierId
- defaultSupplier
- shippingClassId
- shippingClassName
- defaultImageId
- additionalProcessingTime
- metaDescription
- titleTag
- metaKeywords
- languageId
- companyId

**Example Query:**
```graphql
query {
  QueryItems(first: 50, where: { isActive: { eq: true } }) {
    totalCount
    nodes {
      sku
      name
      salesPriceGross
      stockAvailable
      minimumStock
    }
  }
}
```

---

## GetItemById
Fetch single item by ID

**Parameters:** id (required)

**Fields:** Same as QueryItems plus nested details

---

## QueryProductGroups
Fetch product groups (Warengruppen)

**Fields:**
- id
- name
- parentId
- sortNumber

---

## QueryManufacturers
Fetch manufacturers (Hersteller)

**Fields:**
- id
- name
- website
- logoUrl

---

## QueryItemTypes
Fetch item types

**Fields:**
- id
- name

---

# 3. PRODUCT CATEGORIES

## QueryCategories
Fetch product categories (Kategorien)

**Fields:**
- id
- parentId
- sortNumber
- name

**Example Query:**
```graphql
query {
  QueryCategories(first: 100) {
    totalCount
    nodes {
      id
      parentId
      name
      sortNumber
    }
  }
}
```

---

## GetCategoryById
Fetch single category by ID

**Parameters:** id (required)

**Fields:**
- id
- parentId
- sortNumber
- descriptions (nested):
  - categoryId
  - platformId
  - salesChannelId
  - languageId
  - name
  - description
  - metaDescription
  - metaKeywords
  - titleTag
  - urlPath

---

# 4. CUSTOMERS

## QueryCustomers
Fetch customers (Kunden)

**Fields:**
- customerId
- customerNumber
- customerGroupId
- customerGroupName
- companyName
- firstName
- lastName
- street
- postalCode
- city
- countryName
- countryIso
- emailAddress
- phoneNumber
- createdDate
- languageIso

**Nested - customerAddresses:**
- id
- customerId
- addressType
- companyName
- salutation
- title
- firstName
- lastName
- street
- additionalAddressLine
- postalCode
- city
- countryName
- countryIso
- state
- phoneNumber
- mobilePhoneNumber
- faxNumber
- emailAddress

**Example Query:**
```graphql
query {
  QueryCustomers(first: 50, where: { countryIso: { eq: "DE" } }) {
    totalCount
    nodes {
      customerNumber
      companyName
      city
      emailAddress
    }
  }
}
```

---

## GetCustomerById
Fetch single customer by ID

**Parameters:** customerId (required)

**Fields:** Same as QueryCustomers

---

## QueryCustomerGroups
Fetch customer groups (Kundengruppen)

**Fields:**
- id
- name
- discount
- surcharges (nested):
  - categoryId
  - surchargePercent

---

## QueryCustomerCategories
Fetch customer categories

**Fields:**
- id
- name

---

# 5. STOCK / INVENTORY

## QueryStock
Fetch stock levels (Lagerbestand)

**Fields:**
- stockEntryId
- warehouseId
- binLocationId
- articleId
- availableQuantity
- reservedQuantity
- batchNumber
- bestBeforeDate
- serialNumber

**Example Query:**
```graphql
query {
  QueryStock(first: 100) {
    nodes {
      articleId
      warehouseId
      availableQuantity
      reservedQuantity
    }
  }
}
```

---

## QueryStockItem
Fetch stock per item

**Fields:**
- itemId
- sku
- name
- stockTotal
- stockAvailable
- stockReserved
- stockInOrders
- stockIncoming
- minimumStock
- hasMinimumStock

---

## QueryBatches
Fetch batch numbers (Chargen)

**Fields:**
- itemId
- batch
- quantity
- warehouseId

---

## QuerySerialNumbers
Fetch serial numbers (Seriennummern)

**Fields:**
- itemId
- serialNumber
- warehouseId
- binLocationId
- status

---

## QueryBestBeforeDates
Fetch best before dates (MHD)

**Fields:**
- itemId
- bestBeforeDate
- quantity
- warehouseId

---

## QueryStockReservations
Fetch stock reservations

**Fields:**
- id
- itemId
- quantity
- salesOrderId
- salesOrderNumber

---

## QueryStockMovementHistory
Fetch stock movement history

**Fields:**
- id
- itemId
- warehouseId
- binLocationId
- quantity
- movementType
- referenceNumber
- createdDate
- userId

---

# 6. WAREHOUSES

## QueryWarehouses
Fetch warehouses (Lager)

**Fields:**
- id
- name
- active

**Example Query:**
```graphql
query {
  QueryWarehouses(first: 50) {
    totalCount
    nodes {
      id
      name
      active
    }
  }
}
```

---

## QueryBinLocations
Fetch bin locations (Lagerplätze)

**Fields:**
- binLocationId
- warehouseId
- name
- status
- type
- sort

---

## GetBinLocationById
Fetch single bin location

**Parameters:** binLocationId (required)

**Fields:** Same as QueryBinLocations

---

## QueryWarehouseZones
Fetch warehouse zones

**Fields:**
- id
- warehouseId
- name
- zoneType

---

## QueryZoneBinLocations
Fetch bin locations by zone

**Fields:**
- binLocationId
- zoneId
- name

---

## QueryStorageLocations
Fetch storage locations

**Fields:**
- id
- warehouseId
- name
- type

---

## QueryBinLocationOccupancy
Fetch bin location occupancy

**Fields:**
- binLocationId
- lastInventoryDate
- volumeFillFactor
- weightFillFactor

---

## QueryBinLocationPickHeatmap
Fetch pick heatmap

**Fields:**
- binLocationId
- warehouseId
- pickCount
- pickQuantity

---

# 7. SHIPPING

## QueryShippingMethods
Fetch shipping methods (Versandarten)

**Fields:**
- id
- name
- isActive

**Example Query:**
```graphql
query {
  QueryShippingMethods(first: 50) {
    totalCount
    nodes {
      id
      name
      isActive
    }
  }
}
```

---

## QueryShippingClasses
Fetch shipping classes (Versandklassen)

**Fields:**
- id
- name
- description

---

## QueryShippingBoxes
Fetch shipping boxes (Versandkartons)

**Fields:**
- id
- name
- width
- height
- length
- maxWeight

---

## QueryShippingBoxTypes
Fetch shipping box types

**Fields:**
- id
- name

---

# 8. PRODUCTION

## QueryProductionOrders
Fetch production orders (Fertigungsaufträge)

**Fields:**
- id
- productionItemId
- billOfMaterialId
- dispositionId
- lotCount
- lotSize
- targetTotalQuantity
- actualQuantity
- isTargetTotalQuantityBelowLotSizeAllowed
- progress
- targetStartTimestamp
- targetCompletionTimestamp
- actualStartTimestamp
- actualCompletionTimestamp
- projectNumber
- referenceNumber
- issueNumber
- issueDate
- notice
- releaseTimestamp
- deliveryTimestamp
- creationUserId
- releaseUserId
- lastModificationUserId
- lastModificationTimestamp
- resourceTypeId
- workbenchResourceId

**Example Query:**
```graphql
query {
  QueryProductionOrders(first: 50) {
    totalCount
    nodes {
      id
      projectNumber
      targetTotalQuantity
      actualQuantity
      progress
    }
  }
}
```

---

## QueryProductionItems
Fetch production items

**Fields:**
- id
- itemId
- sku
- name
- description

---

## QueryBillsOfMaterialsByProductionItemId
Fetch bills of materials

**Fields:**
- id
- productionItemId
- version
- name
- description
- state
- createDate
- updateDate
- updateUserId
- activationDate
- producibleStock
- producibleStockCalculationDate

---

## QueryLotSizesByProductionItemId
Fetch lot sizes

**Fields:**
- id
- productionItemId
- quantity
- isDefault

---

## QueryWorkbenchResources
Fetch workbench resources

**Fields:**
- id
- name
- resourceTypeId
- description
- capacity

---

## QueryWorkbenchResourceTypes
Fetch resource types

**Fields:**
- id
- name
- description

---

## QueryResourceCategories
Fetch resource categories

**Fields:**
- id
- name
- description

---

# 9. INVOICES

## QuerySalesInvoices
Fetch sales invoices (Rechnungen)

**Fields:**
- salesInvoiceId
- createdByUserId
- createdByUserName
- customerId
- customerNumber
- currencyIso
- companyId
- companyName
- vatIdNumber
- paymentMethodId
- paymentMethodName
- isDunningBlocked
- salesInvoiceDate
- valueDate
- salesInvoiceNumber
- currencyFactor
- shippingMethodId
- shippingMethodName
- isDraft
- salesChannelId
- platformId
- languageId
- taxSetting
- isIntraCommunityDelivery
- isExemptFromVat
- ebayUsername
- salesChannelName
- isExternalSalesInvoice
- printExistingSalesInvoice
- paymentDate
- printDate
- mailDate
- isDunned
- stillToPay
- alreadyPaidAmount
- isCompletelyPaid
- comment
- customerComment
- salesInvoiceCorrectionTotalGrossAmount
- hasSalesInvoiceCorrection
- paymentStatus
- totalGrossAmount
- totalNetAmount
- accountsReceivableNumber
- customerGroupName
- paymentDueDateInDays
- paymentDueDate
- dunningLevel
- dunningDate
- isArchived
- processColourCode
- processColourName
- platformType
- salesOrderNumber
- salesOrderId
- externalSalesOrderNumber
- isCorrected
- isCancelled
- cancelledDate
- cancellationComment
- cancellationUserName
- cancellationReason
- serviceDateFrom
- serviceDateTo
- lastShippingDate
- shipmentAddressCompanyName
- shipmentAddressCity
- shipmentAddressCountryIso
- billingAddressCompanyName
- billingAddressCity
- billingAddressCountryIso

**Example Query:**
```graphql
query {
  QuerySalesInvoices(first: 50, where: { isCompletelyPaid: { eq: false } }) {
    totalCount
    nodes {
      salesInvoiceNumber
      customerNumber
      totalGrossAmount
      stillToPay
      paymentDueDate
    }
  }
}
```

---

## QuerySalesInvoiceCorrections
Fetch invoice corrections (Rechnungskorrekturen)

**Fields:**
- salesInvoiceCorrectionId
- salesInvoiceId
- salesInvoiceNumber
- correctionNumber
- correctionDate
- totalGrossAmount
- totalNetAmount
- reason
- comment

---

## QuerySalesInvoiceCancellationReasons
Fetch cancellation reasons

**Fields:**
- id
- name

---

# 10. MARKETPLACE

## QueryMarketplaceOffer
Fetch marketplace offers

**Fields:**
- id
- itemId
- sku
- name
- marketplaceId
- marketplaceName
- status
- price
- quantity
- lastSyncDate

---

## QuerySalesChannels
Fetch sales channels (Verkaufskanäle)

**Fields:**
- id
- name
- type
- platformId
- isActive

**Example Query:**
```graphql
query {
  QuerySalesChannels(first: 50) {
    totalCount
    nodes {
      id
      name
      type
      isActive
    }
  }
}
```

---

## QueryMarketplaceNotification
Fetch marketplace notifications

**Fields:**
- id
- type
- message
- createdDate
- isRead

---

## QueryMarketplaceExternalDocument
Fetch external documents

**Fields:**
- id
- documentType
- documentNumber
- externalId
- createdDate

---

# 11. MASTER DATA

## QueryCountries
Fetch countries (Länder)

**Fields:**
- iso
- name
- isEuMember

**Example Query:**
```graphql
query {
  QueryCountries(first: 100) {
    totalCount
    nodes {
      iso
      name
      isEuMember
    }
  }
}
```

---

## QueryCurrencies
Fetch currencies (Währungen)

**Fields:**
- iso
- name
- symbol
- factor

---

## QueryTaxClasses
Fetch tax classes (Steuerklassen)

**Fields:**
- id
- name

---

## ListTaxClassesWithTaxRates
Fetch tax classes with rates

**Fields:**
- id
- name
- taxRates (nested)

---

## QueryTaxCodes
Fetch tax codes

**Fields:**
- id
- code
- name
- rate

---

## QueryPaymentMethods
Fetch payment methods (Zahlungsarten)

**Fields:**
- id
- name
- isActive

---

## QueryLanguages
Fetch languages (Sprachen)

**Fields:**
- id
- iso
- name

---

## QueryCustomFields
Fetch custom fields

**Fields:**
- id
- name
- type
- isRequired

---

# 12. COMPANIES

## QueryCompanies
Fetch companies (Firmen)

**Fields:**
- id
- companyName
- owner
- street
- postalCode
- city
- country
- countryIsoCode
- phone
- fax
- emailAddress
- website
- bankCode
- accountNumber
- bankName
- taxId
- iban
- bic
- accountHolder
- creditorId
- payPalEmailAddress
- isSmallBusinessOwner
- dhlIntrashipCustomerId
- upsCustomerId
- companyVatIdentifiers (nested)

**Example Query:**
```graphql
query {
  QueryCompanies(first: 10) {
    totalCount
    nodes {
      id
      companyName
      city
      emailAddress
    }
  }
}
```

---

## GetCompanyById
Fetch single company

**Parameters:** id (required)

**Fields:** Same as QueryCompanies

---

# 13. SUPPLIERS

## QuerySuppliers
Fetch suppliers (Lieferanten)

**Fields:**
- id
- name
- canDropship
- currencyIso

**Example Query:**
```graphql
query {
  QuerySuppliers(first: 50) {
    totalCount
    nodes {
      id
      name
      canDropship
      currencyIso
    }
  }
}
```

---

## GetItemSuppliersById
Fetch item suppliers

**Fields:**
- id
- supplierId
- supplierName
- supplierItemNumber
- purchasePriceNet
- minimumOrderQuantity
- deliveryTimeDays
- isDefault

---

# 14. PICKLISTS / ORDER FULFILLMENT

## QueryPicklists
Fetch picklists (Picklisten)

**Fields:**
- id
- pickListNumber
- createdDate
- status
- warehouseId
- positions (nested):
  - id
  - itemId
  - sku
  - name
  - quantity
  - pickedQuantity
  - binLocationId

---

## QueryOrderData
Fetch order data for fulfillment

**Fields:**
- salesOrderId
- salesOrderNumber
- itemId
- sku
- name
- quantity
- pickedQuantity
- shippedQuantity
- status

---

# QUERY SYNTAX

## Filtering
```graphql
where: { fieldName: { operator: value } }
```

**Operators:**
- eq - equals
- neq - not equals
- gt - greater than
- gte - greater than or equal
- lt - less than
- lte - less than or equal
- contains - string contains
- startsWith - string starts with
- endsWith - string ends with

**Multiple conditions:**
```graphql
where: { and: [{ field1: { eq: value1 } }, { field2: { gt: value2 } }] }
where: { or: [{ field1: { eq: value1 } }, { field2: { eq: value2 } }] }
```

## Ordering
```graphql
order: [{ fieldName: ASC }]
order: [{ fieldName: DESC }]
order: [{ field1: DESC }, { field2: ASC }]
```

## Pagination
```graphql
first: 50        # Get first 50 records
after: "cursor"  # Get records after cursor
```

## Date Format
```
"2026-04-27"
"2026-04-27T00:00:00Z"
```

---

# COMPLETE QUERY EXAMPLE

```graphql
query {
  # Get recent orders with customer and line item details
  QuerySalesOrders(
    first: 10
    where: { salesOrderDate: { gte: "2026-04-01" } }
    order: [{ salesOrderDate: DESC }]
  ) {
    totalCount
    nodes {
      salesOrderNumber
      salesOrderDate
      totalGrossAmount
      currencyIso
      paymentStatus
      billingAddress {
        companyName
        city
        countryIso
      }
      lineItems {
        sku
        name
        quantity
        totalSalesPriceGross
      }
    }
  }
}
```

---

# TOTAL: 91 Queries, 338 Types, 13 Domains
