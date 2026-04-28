# JTL ERP Complete Database Reference

**This file contains ALL data available from JTL ERP GraphQL API.**

- **Total Queries:** 93
- **Total Types:** 338
- **Generated from:** JTL ERP GraphQL Introspection
- **API Endpoint:** https://api.jtl-cloud.com/erp/v2/graphql

---

# PART 1: ALL AVAILABLE QUERIES (93)

These are the entry points to fetch data from JTL ERP.

1. QueryBillOfMaterialsItemById
2. QueryBillOfMaterialsItemsByBillOfMaterialsId
3. QueryBillOfMaterialsItemsByBillOfMaterialsOperationId
4. QueryBillOfMaterialsOperationById
5. QueryBillOfMaterialsOperationsByBillOfMaterialsId
6. QueryBillOfMaterialsById
7. QueryBillsOfMaterialsByProductionItemId
8. QueryLotSizeById
9. QueryLotSizesByProductionItemId
10. QueryProductionItems
11. QueryProductionItemById
12. QueryProductionItemByItemId
13. QueryProductionOrders
14. QueryProductionOrderById
15. QueryResourceCategories
16. QueryWorkbenchResources
17. QueryWorkbenchResourceById
18. QueryWorkbenchResourceTypes
19. QueryWorkbenchResourceTypeById
20. GetCategoryById
21. QueryCategories
22. GetCompanyById
23. QueryCompanies
24. QueryCustomFields
25. GetItemById
26. QueryItems
27. GetItemSuppliersById
28. QueryItemTypes
29. QueryManufacturers
30. QueryProductGroups
31. QueryShippingClasses
32. GetCustomerById
33. QueryCustomerCategories
34. QueryCustomerGroups
35. QueryCustomers
36. QueryMarketplaceNotificationDetail
37. QueryMarketplaceNotification
38. QueryMarketplaceOffer
39. QueryMarketplaceExternalDocument
40. QueryMarketplaceOrderCancellationRequestUpload
41. QueryMarketplaceOrderCancellationUpload
42. QueryMarketplacePaymentUpload
43. QueryMarketplaceReturnUploadLineItem
44. QueryMarketplaceReturnUpload
45. QueryMarketplaceShippingInformationUpload
46. QueryShippingMethods
47. QueryCountries
48. QueryLanguages
49. QueryTaxClasses
50. ListTaxClassesWithTaxRates
51. QueryTaxCodes
52. QueryCurrencies
53. QueryExternalDocumentsInternal
54. QueryExternalDocumentLineItemsInternal
55. QuerySalesInvoiceCorrectionsInternal
56. QuerySalesInvoiceCorrectionLineItemsInternal
57. QuerySalesInvoicesInternal
58. QuerySalesInvoiceLineItemsInternal
59. QuerySalesInvoiceCancellationsInternal
60. QueryPaymentMethods
61. QuerySalesChannels
62. QuerySalesInvoiceCorrections
63. QuerySalesInvoiceCancellationReasons
64. QuerySalesInvoices
65. GetEmptySalesOrder
66. ListItemPriceDetails
67. GetSalesOrderById
68. QuerySalesOrders
69. GetSalesQuotationById
70. QuerySalesQuotations
71. QuerySuppliers
72. QueryPicklists
73. QueryOrderData
74. QueryBatches
75. QueryBestBeforeDates
76. QueryStockReservations
77. QuerySerialNumbers
78. QueryStockItem
79. QueryStock
80. QueryBinLocationPickHeatmap
81. QueryShippingBoxes
82. QueryShippingBoxTypes
83. QueryBinLocations
84. GetBinLocationById
85. QueryBinLocationOccupancy
86. GetBinLocationStatuses
87. GetBinLocationTypes
88. QueryStockMovementHistory
89. QueryWarehouseZones
90. QueryZoneBinLocations
91. QueryZoneTypes
92. QueryStorageLocations
93. QueryWarehouses

---

# PART 2: ALL TYPES WITH ALL FIELDS (338)

Each type shows all available fields and their data types.

---

## AddItemSupplierCommandResponse

| Field | Type |
|-------|------|
| itemId | ID |

## AddItemVariationCommandResponse

| Field | Type |
|-------|------|
| variationId | ID |

## AddItemVariationValueCommandResponse

| Field | Type |
|-------|------|
| variationValueId | ID |

## AttributeSalesChannelValues

| Field | Type |
|-------|------|
| salesChannelId | ID |
| values | Object |

## AttributeValue

| Field | Type |
|-------|------|
| languageIso | String |
| value | String |

## AttributeValues

| Field | Type |
|-------|------|
| attributeId | ID |
| defaultValues | Object |
| salesChannelValues | Object |

## BatchListItem

| Field | Type |
|-------|------|
| itemId | ID |
| batch | String |
| quantity | Decimal |
| warehouseId | ID |

## BestBeforeListItem

| Field | Type |
|-------|------|
| itemId | ID |
| bestBeforeDate | DateTime |
| quantity | Decimal |
| warehouseId | ID |

## BillOfMaterials

| Field | Type |
|-------|------|
| id | ID |
| productionItemId | ID |
| version | Int |
| name | String |
| description | String |
| state | BillOfMaterialsState |
| createDate | DateTime |
| updateDate | DateTime |
| updateUserId | ID |
| activationDate | DateTime |
| producibleStock | Decimal |
| producibleStockCalculationDate | DateTime |
| componentPostingsShelfLifeEndDateRequirements | OverallComponentPostingsInventoryAccountingDataRequirements |
| componentPostingsBatchNumberRequirements | OverallComponentPostingsInventoryAccountingDataRequirements |
| shelfLifeEndDateGenerationMode | ShelfLifeEndDateGenerationMode |
| additionalShelfLifeEndDateTime | TimeSpan |

## BillOfMaterialsChildComponentProperties

| Field | Type |
|-------|------|
| parentId | ID |

## BillOfMaterialsComponentProperties

| Field | Type |
|-------|------|
| id | ID |
| billOfMaterialsId | ID |
| sort | Int |

## BillOfMaterialsItem

| Field | Type |
|-------|------|
| billOfMaterialsComponentProperties | BillOfMaterialsComponentProperties |
| billOfMaterialsChildComponentProperties | BillOfMaterialsChildComponentProperties |
| billOfMaterialsItemProperties | BillOfMaterialsItemProperties |

## BillOfMaterialsItemProperties

| Field | Type |
|-------|------|
| itemId | ID |
| quantity | Decimal |
| measurementUnitId | ID |
| operationStepId | ID |
| componentPostingsShelfLifeEndDateRequirements | ComponentPostingsInventoryAccountingDataRequirements |
| componentPostingsBatchNumberRequirements | ComponentPostingsInventoryAccountingDataRequirements |

## BillOfMaterialsOperation

| Field | Type |
|-------|------|
| billOfMaterialsComponentProperties | BillOfMaterialsComponentProperties |
| billOfMaterialsOperationProperties | BillOfMaterialsOperationProperties |

## BillOfMaterialsOperationProperties

| Field | Type |
|-------|------|
| operationId | ID |

## BinLocationListItem

| Field | Type |
|-------|------|
| binLocationId | ID |
| warehouseId | ID |
| name | String |
| status | Int |
| type | Int |
| sort | Int |

## BinLocationOccupancyItem

| Field | Type |
|-------|------|
| binLocationId | ID |
| lastInventoryDate | DateTime |
| volumeFillFactor | Decimal |
| weightFillFactor | Decimal |

## BinLocationPickHeatmapItem

| Field | Type |
|-------|------|
| binLocationId | ID |
| warehouseId | ID |
| pickCount | Int |
| pickQuantity | Decimal |

## BinLocationStatusDto

| Field | Type |
|-------|------|
| value | Int |
| name | String |

## BinLocationTypeDto

| Field | Type |
|-------|------|
| value | Int |
| name | String |

## CalculateSalesOrderCommandResponse

| Field | Type |
|-------|------|
| lineItems | Object |
| totalNetAmount | Decimal |
| totalGrossAmount | Decimal |
| companyVatId | String |
| currencyIso | String |
| currencyFactor | Decimal |
| shippingCostNet | Decimal |
| vatAmounts | Object |
| shippingCostGross | Decimal |

## CalculateSalesOrderLineItemResponse

| Field | Type |
|-------|------|
| syncNumber | Int |
| type | LineItemType |
| itemId | ID |
| quantity | Decimal |
| salesPriceNet | Decimal |
| salesPriceGross | Decimal |
| discountPercent | Decimal |
| taxRate | Decimal |
| taxClassId | ID |
| parentSyncNumber | Int |

## CalculateSalesOrderVatAmount

| Field | Type |
|-------|------|
| taxRate | Decimal |
| vatAmount | Decimal |

## CategoryDetails

| Field | Type |
|-------|------|
| id | ID |
| parentId | ID |
| sortNumber | Int |
| descriptions | Object |

## CategoryDetailsDescription

| Field | Type |
|-------|------|
| categoryId | ID |
| platformId | ID |
| salesChannelId | ID |
| languageId | ID |
| name | String |
| description | String |
| metaDescription | String |
| metaKeywords | String |
| titleTag | String |
| urlPath | String |

## CategoryListItem

| Field | Type |
|-------|------|
| id | ID |
| parentId | ID |
| sortNumber | Int |
| name | String |

## ChangeItemCommandResponse

| Field | Type |
|-------|------|
| item | ItemdetailsItem |

## CompanyAddress

| Field | Type |
|-------|------|
| id | ID |
| name | String |
| entrepreneur | String |
| street | String |
| zipCode | String |
| city | String |
| country | String |
| phone | String |
| mail | String |
| iso | String |

## CompanyDetailsItem

| Field | Type |
|-------|------|
| id | ID |
| companyName | String |
| owner | String |
| street | String |
| postalCode | String |
| city | String |
| country | String |
| countryIsoCode | String |
| phone | String |
| fax | String |
| emailAddress | String |
| website | String |
| bankCode | String |
| accountNumber | String |
| bankName | String |
| taxId | String |
| iban | String |
| bic | String |
| accountHolder | String |
| creditorId | String |
| payPalEmailAddress | String |
| isSmallBusinessOwner | Boolean |
| dhlIntrashipCustomerId | String |
| upsCustomerId | String |
| companyVatIdentifiers | Object |

## CompanyListItem

| Field | Type |
|-------|------|
| id | ID |
| companyName | String |
| owner | String |
| street | String |
| postalCode | String |
| city | String |
| country | String |
| countryIsoCode | String |
| phone | String |
| fax | String |
| emailAddress | String |
| website | String |
| bankCode | String |
| accountNumber | String |
| bankName | String |
| taxId | String |
| iban | String |
| bic | String |
| accountHolder | String |
| creditorId | String |
| payPalEmailAddress | String |
| isSmallBusinessOwner | Boolean |
| dhlIntrashipCustomerId | String |
| upsCustomerId | String |
| companyVatIdentifiers | Object |

## CompanyVatIdDetailsItem

| Field | Type |
|-------|------|
| id | ID |
| companyId | ID |
| countryIsoCode | String |
| vatIdentifier | String |
| isShippingCountry | Boolean |

## CompanyVatIdItem

| Field | Type |
|-------|------|
| id | ID |
| companyId | ID |
| countryIsoCode | String |
| vatIdentifier | String |
| isShippingCountry | Boolean |

## CopyItemdetailsCommandResponse

| Field | Type |
|-------|------|
| itemId | ID |

## CountryItem

| Field | Type |
|-------|------|
| countryIso | String |
| countryIso3 | String |
| name | String |
| continent | String |
| currencyIso | String |
| numericIso | Int |
| isEu | Boolean |
| defaultCulture | String |
| displayNameState | String |
| knownStates | CountryStateItem |

## CountryStateItem

| Field | Type |
|-------|------|
| regionCode | String |
| isoCode | String |
| name | String |

## CreateBillOfMaterialsCommandResponse

| Field | Type |
|-------|------|
| id | ID |

## CreateBillOfMaterialsItemCommandResponse

| Field | Type |
|-------|------|
| id | ID |

## CreateBillOfMaterialsOperationCommandResponse

| Field | Type |
|-------|------|
| id | ID |

## CreateBinLocationCommandResponse

| Field | Type |
|-------|------|
| binLocationId | ID |

## CreateCategoryCommandResponse

| Field | Type |
|-------|------|
| categoryId | ID |

## CreateCustomerCommandResponse

| Field | Type |
|-------|------|
| customerId | ID |

## CreateItemCommandResponse

| Field | Type |
|-------|------|
| itemId | ID |

## CreateLotSizeCommandResponse

| Field | Type |
|-------|------|
| id | ID |

## CreateProductionItemCommandResponse

| Field | Type |
|-------|------|
| id | ID |

## CreateProductionOrderCommandResponse

| Field | Type |
|-------|------|
| id | ID |

## CreateSalesInvoiceCommandResponse

| Field | Type |
|-------|------|
| salesInvoiceId | ID |

## CreateSalesInvoiceCorrectionCommandResponse

| Field | Type |
|-------|------|
| salesInvoiceCorrectionId | ID |

## CreateSalesOrderCommandResponse

| Field | Type |
|-------|------|
| salesOrderId | ID |

## CreateSalesOrderFromSalesQuotationCommandResponse

| Field | Type |
|-------|------|
| salesOrderId | ID |

## CreateSalesQuotationCommandResponse

| Field | Type |
|-------|------|
| salesQuotationId | ID |

## CreateShippingBoxCommandResponse

| Field | Type |
|-------|------|
| shippingBoxId | ID |

## CreateShippingClassCommandResponse

| Field | Type |
|-------|------|
| id | ID |

## CreateWarehouseZoneCommandResponse

| Field | Type |
|-------|------|
| zoneId | ID |

## CreateWorkbenchResourceCommandResponse

| Field | Type |
|-------|------|
| id | ID |

## CreateWorkbenchResourceTypeCommandResponse

| Field | Type |
|-------|------|
| id | ID |

## Currency

| Field | Type |
|-------|------|
| id | ID |
| factor | Decimal |
| isDefault | Boolean |
| iso | String |
| name | String |
| updated | DateTime |

## CustomFieldListItem

| Field | Type |
|-------|------|
| customFieldKey | ID |
| name | String |
| group | String |
| customFieldType | CustomFieldType |
| dataType | String |
| isRequired | Boolean |
| referenceType | CustomFieldReferenceType |
| sort | Int |
| isReadonly | Boolean |
| isInvisible | Boolean |
| description | String |

## Customer

| Field | Type |
|-------|------|
| customerId | ID |
| customerGroupId | ID |
| customerNumber | String |
| createdDate | DateTime |
| customerAddresses | Object |
| customerGroup | CustomerGroup |
| languageIso | String |

## CustomerAddress

| Field | Type |
|-------|------|
| customerAddressId | ID |
| customerId | ID |
| isDefault | Boolean |
| addressType | CustomerAddressType |
| companyName | String |
| additionalCompanyLine | String |
| salutation | String |
| title | String |
| firstName | String |
| lastName | String |
| street | String |
| additionalAddressLine | String |
| postalCode | String |
| city | String |
| countryIso | String |
| state | String |
| emailAddress | String |
| faxNumber | String |
| phoneNumber | String |
| mobilePhoneNumber | String |
| vatId | String |

## CustomerCategory

| Field | Type |
|-------|------|
| id | ID |
| name | String |

## CustomerGroup

| Field | Type |
|-------|------|
| id | ID |
| name | String |
| isDefault | Boolean |
| discount | Decimal |
| isNetPrice | Boolean |

## CustomerGroupSurcharge

| Field | Type |
|-------|------|
| customerGroupId | ID |
| surcharge | Decimal |
| isActive | Boolean |

## CustomerListItem

| Field | Type |
|-------|------|
| id | ID |
| customerNumber | String |
| ebayName | String |
| birthday | String |
| homepage | String |
| lastName | String |
| firstName | String |
| phoneNumber | String |
| faxNumber | String |
| emailAddress | String |
| companyName | String |
| postalCode | String |
| city | String |
| countryName | String |
| countryIso | String |
| additionalCompanyLine | String |
| salutation | String |
| title | String |
| street | String |
| additionalAddressLine | String |
| createdDate | DateTime |
| mobilePhoneNumber | String |
| discountRate | Decimal |
| vatId | String |
| hasNewsletter | Boolean |
| postId | String |
| paymentDueDateInDays | Int |
| state | String |
| initialContact | String |
| isCashRegisterBased | Boolean |
| isLocked | Boolean |
| commercialRegisterNumber | String |
| accountsReceivableNumber | Int |
| customerCategoryName | String |
| customerGroupName | String |
| customerCategoryId | ID |
| customerGroupId | ID |
| isJtlFulfillment | Boolean |
| labels | String |
| languageIso | String |

## DefaultDescription

| Field | Type |
|-------|------|
| languageIso | String |
| descriptionData | DescriptionData |

## DeleteItemVariationCommandResponse

| Field | Type |
|-------|------|
| variationId | ID |

## DeleteItemVariationValueCommandResponse

| Field | Type |
|-------|------|
| variationValueId | ID |

## DeliveryNoteItem

| Field | Type |
|-------|------|
| id | ID |
| createdAt | DateTime |
| number | String |

## Description

| Field | Type |
|-------|------|
| languageIso | String |
| name | String |

## DescriptionData

| Field | Type |
|-------|------|
| itemName | String |
| shortDescription | String |
| description | String |
| metaDescription | String |
| metaKeywords | String |
| titleTag | String |
| urlPath | String |

## DuplicateItemsCommandResponse

| Field | Type |
|-------|------|
| createdItems | ID |

## EbayImages

| Field | Type |
|-------|------|
| ebayAccountId | ID |
| images | Object |

## EmptySalesOrder

| Field | Type |
|-------|------|
| salesOrderDate | DateTime |
| itemDescriptionType | ItemDescriptionType |
| readOnlyType | ReadOnlyType |
| companyId | ID |
| languageId | ID |
| additionalWeight | Decimal |
| vatId | String |
| specialTaxTreatment | SpecialTaxTreatment |
| taxSetting | TaxSetting |
| departureCountry | EmptySalesOrderDepartureCountry |
| paymentDetails | EmptySalesOrderPaymentDetails |
| billingAddress | EmptySalesOrderAddress |
| shipmentAddress | EmptySalesOrderAddress |

## EmptySalesOrderAddress

| Field | Type |
|-------|------|
| salutation | String |
| title | String |
| firstName | String |
| lastName | String |
| company | String |
| additionalCompanyLine | String |
| street | String |
| additionalAddressLine | String |
| postalCode | String |
| city | String |
| state | String |
| countryIso | String |
| countryName | String |
| emailAddress | String |
| phoneNumber | String |
| mobilePhoneNumber | String |
| fax | String |

## EmptySalesOrderDepartureCountry

| Field | Type |
|-------|------|
| countryIso | String |
| currencyIso | String |
| currencyFactor | Decimal |

## EmptySalesOrderPaymentDetails

| Field | Type |
|-------|------|
| currencyIso | String |
| currencyFactor | Decimal |
| paymentDueDateInDays | Int |
| cashDiscount | Decimal |
| cashDiscountDays | Int |

## ExternalDocumentInternal

| Field | Type |
|-------|------|
| externalDocumentTransactionId | ID |
| companyId | ID |
| customerId | ID |
| platformId | ID |
| paymentMethodId | ID |
| externalInvoiceDocumentId | ID |
| salesInvoiceNumber | String |
| externalDocumentNumber | String |
| externalDocumentDate | DateTime |
| externalDocumentOrderNumber | String |
| currencyFactor | Decimal |
| currency | String |
| departureCountryCurrencyIso | String |
| departureCountryCurrenyFactor | Decimal |
| serviceDate | DateTime |
| payDate | DateTime |
| platformIdentifier | String |
| accountsReceivableNumber | Int |
| taxSetting | Byte |
| externalDocumentType | Byte |
| companyVatIdNumber | String |
| customerVatIdNumber | String |
| departureCountryIso | String |
| paymentMethodName | String |
| orderDate | DateTime |
| shipmentAddressCompany | String |
| shipmentAddressLastName | String |
| shipmentAddressStreet | String |
| shipmentAddressPostalCode | String |
| shipmentAddressCity | String |
| shipmentAddressPhoneNumber | String |
| shipmentAddressAdditionalAddressLine | String |
| shipmentAddressCountryIso | String |
| shipmentAddressVatIdNumber | String |
| customerDefaultBillingAddressCompany | String |
| customerDefaultBillingAddressSalutation | String |
| customerDefaultBillingAddressTitle | String |
| customerDefaultBillingAddressFirstName | String |
| customerDefaultBillingAddressLastName | String |
| customerDefaultBillingAddressStreet | String |
| customerDefaultBillingAddressPostalCode | String |
| customerDefaultBillingAddressCity | String |
| customerDefaultBillingAddressCountry | String |
| customerDefaultBillingAddressPhoneNumber | String |
| customerDefaultBillingAddressFaxNumber | String |
| customerDefaultBillingAddressForTheAttentionOf | String |
| customerDefaultBillingAddressCountryIso | String |
| customerDefaultBillingAddressEmailAddress | String |
| customerDefaultBillingAddressVatIdNumber | String |
| salesOrderCustomerNumber | String |
| customerGroupName | String |
| paymentDueDateInDays | Int |
| customerNumber | String |
| billingAddressCompany | String |
| billingAddressLastName | String |
| billingAddressStreet | String |
| billingAddressPostalCode | String |
| billingAddressCity | String |
| billingAddressPhoneNumber | String |
| billingAddressAdditionalAddressLine | String |
| billingAddressCountryIso | String |
| billingAddressVatIdNumber | String |
| externalDocumentTotalGrossValue | Decimal |
| externalDocumentTotalNetValue | Decimal |
| shipmentDate | DateTime |
| orderPaymentMethodName | String |
| shipmentCountryCount | Int |

## ExternalDocumentLineItemInternal

| Field | Type |
|-------|------|
| externalDocumentLineItemId | ID |
| externalDocumentId | ID |
| externalDocumentSalesPriceGross | Decimal |
| externalDocumentSalesPriceNet | Decimal |
| externalDocumentPurchasePriceNet | Decimal |
| quantity | Decimal |
| itemName | String |
| sku | String |
| taxRate | Decimal |
| taxClassId | ID |
| taric | String |
| itemWeight | Decimal |
| itemVolume | Decimal |
| productGroupId | ID |
| purchasePriceNet | Decimal |
| productGroup | String |
| warehouseId | ID |
| externalDocumentInvoiceLineItemId | ID |

## GetItemSuppliersByIdConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | GetItemSuppliersByIdEdge |
| nodes | ItemSupplierListItem |
| totalCount | Int |

## GetItemSuppliersByIdEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ItemSupplierListItem |

## ItemAttributes

| Field | Type |
|-------|------|
| values | Object |

## ItemCategories

| Field | Type |
|-------|------|
| categories | Object |

## ItemCategory

| Field | Type |
|-------|------|
| categoryId | ID |

## ItemCustomFieldValue

| Field | Type |
|-------|------|
| fieldId | ID |
| value | String |
| valueCultureName | String |

## ItemCustomFields

| Field | Type |
|-------|------|
| fieldValues | Object |

## ItemCustomerGroupPrices

| Field | Type |
|-------|------|
| customerGroupId | ID |
| prices | Object |

## ItemCustomerGroupSpecialPrice

| Field | Type |
|-------|------|
| customerGroupId | ID |
| netPrice | Decimal |
| isActive | Boolean |

## ItemCustomerPrices

| Field | Type |
|-------|------|
| customerId | ID |
| prices | Object |

## ItemDescriptions

| Field | Type |
|-------|------|
| defaultDescriptions | Object |
| salesChannelDescriptions | Object |
| platformDescriptions | Object |

## ItemFeature

| Field | Type |
|-------|------|
| featureId | ID |

## ItemFeatures

| Field | Type |
|-------|------|
| features | Object |

## ItemIdentifiers

| Field | Type |
|-------|------|
| sku | String |
| amazonFnsku | String |
| gtin | String |
| manufacturerNumber | String |
| isbn | String |
| tariccode | String |
| upc | String |
| unNumber | String |
| hazardNumber | String |
| ownIdentifier | String |
| defaultAsin | String |
| jfsku | String |

## ItemImage

| Field | Type |
|-------|------|
| blobIdentifier | UUID |
| url | String |
| previewUrl | String |
| sortNumber | Int |
| isMainImage | Boolean |

## ItemImages

| Field | Type |
|-------|------|
| defaultImages | Object |
| platformImages | Object |
| saleschannelImages | Object |
| ebayImages | Object |

## ItemListItem

| Field | Type |
|-------|------|
| id | ID |
| billOfMaterialsId | Int |
| parentItemId | ID |
| itemIdForCategoryItemId | ID |
| sku | String |
| sortNumber | Int |
| name | String |
| unit | String |
| description | String |
| shortDescription | String |
| notes | String |
| labels | String |
| series | String |
| gtin | String |
| manufacturerNumber | String |
| isbn | String |
| defaultAsin | String |
| taricCode | String |
| upc | String |
| unNumber | String |
| hazardNumber | String |
| amazonFnsku | String |
| jfsku | String |
| countryOfOrigin | String |
| manufacturerName | String |
| deliveryStatus | String |
| isDeliveryTimeAutomatic | Boolean |
| manualDeliveryTimeDays | Int |
| width | Decimal |
| height | Decimal |
| length | Decimal |
| shippingWeight | Decimal |
| weight | Decimal |
| createdDate | DateTime |
| modifiedDate | DateTime |
| modifiedTimestamp | DateTime |
| releaseDate | DateTime |
| lastPurchaseDate | DateTime |
| lastEditor | String |
| salesPriceNet | Decimal |
| salesPriceGross | Decimal |
| suggestedRetailPrice | Decimal |
| averagePurchasePriceNet | Decimal |
| lastPurchasePrice | Decimal |
| amazonPrice | Decimal |
| ebayPrice | Decimal |
| profit | Decimal |
| profitPercent | Decimal |
| specialPriceStatus | Int |
| basePriceValue | Decimal |
| basePriceUnit | String |
| measurementUnit | String |
| stockTotal | Decimal |
| stockOwn | Decimal |
| stockIncoming | Decimal |
| stockOnPurchaseList | Decimal |
| stockInOrders | Decimal |
| stockAvailable | Decimal |
| stockReservedTotal | Decimal |
| stockInAmazonOffers | Int |
| ebayStock | Decimal |
| minimumOrderQuantity | Decimal |
| purchaseInterval | Decimal |
| buffer | Int |
| minimumStock | Decimal |
| allowNegativeStock | Boolean |
| isInventoryManagementActive | Boolean |
| isDivisible | Boolean |
| hasBatch | Boolean |
| hasBestBeforeDate | Boolean |
| isSerialNumberManaged | Boolean |
| serialNumberTrackingMode | SerialNumberTrackingMode |
| isActive | Boolean |
| isOnPriceList | Boolean |
| isTopItem | Boolean |
| isNew | Boolean |
| isBillOfMaterials | Boolean |
| isBillOfMaterialsComponent | Boolean |
| isVariationParent | Boolean |
| isVariationChild | Boolean |
| hasMinimumStock | Boolean |
| isBlockedForOrderSuggestions | Boolean |
| isShopActive | Boolean |
| isOrderProcessProhibited | Boolean |
| salesPackagingUnit | Byte |
| conditionId | ID |
| conditionName | String |
| isFulfillmentActive | Boolean |
| isFulfillmentOwn | Boolean |
| taxClassId | ID |
| taxClassName | String |
| manufacturerId | ID |
| productGroupId | ID |
| productGroupName | String |
| defaultSupplierId | ID |
| defaultSupplier | String |
| shippingClassId | ID |
| shippingClassName | String |
| defaultImageId | ID |
| additionalProcessingTime | Int |
| metaDescription | String |
| titleTag | String |
| metaKeywords | String |
| languageId | ID |
| companyId | ID |

## ItemMeasurements

| Field | Type |
|-------|------|
| height | Decimal |
| length | Decimal |
| shippingWeight | Decimal |
| weight | Decimal |
| width | Decimal |

## ItemPrice

| Field | Type |
|-------|------|
| fromQuantity | Int |
| netPrice | Decimal |
| reduceStandardPriceByPercent | Decimal |

## ItemPriceDetails

| Field | Type |
|-------|------|
| itemId | ID |
| defaultSalesPriceNet | Decimal |
| latestSalesPriceNet | Decimal |
| customersLatestSalesPriceNet | Decimal |
| purchasePriceNet | Decimal |
| latestPurchasePriceNet | Decimal |

## ItemPrices

| Field | Type |
|-------|------|
| ignoreDiscounts | Boolean |
| salesPriceNet | Decimal |
| suggestedRetailPrice | Decimal |
| purchasePriceNet | Decimal |
| ebayPrice | Decimal |
| amazonPrice | Decimal |
| salesChannelPrices | Object |
| customerPrices | Object |
| defaultPrices | Object |

## ItemSalesChannelSpecialPrices

| Field | Type |
|-------|------|
| salesChannelId | ID |
| specialPrices | Object |

## ItemSaleschannelPrices

| Field | Type |
|-------|------|
| saleschannelId | ID |
| customerGroupPrices | Object |
| isActive | Boolean |

## ItemSpecialPrices

| Field | Type |
|-------|------|
| isActive | Boolean |
| startDate | DateTime |
| endDate | DateTime |
| isEndDateActive | Boolean |
| minimumStockQuantity | Int |
| isStockRestrictionActive | Boolean |
| salesChannelSpecialPrices | Object |

## ItemStorageConstraints

| Field | Type |
|-------|------|
| allowNegativeStock | Boolean |
| itemPlatformNegativeStocks | Object |
| itemSalesChannelNegativeStocks | Object |
| buffer | Int |
| globalMinimumStockLevel | Decimal |
| hasBatch | Boolean |
| isInventoryManagementActive | Boolean |
| isBestBeforeManaged | Boolean |
| isStockDivisible | Boolean |
| serialNumberType | SerialNumberType |

## ItemSupplier

| Field | Type |
|-------|------|
| supplierId | ID |
| supplierItemName | String |
| supplierItemNumber | String |
| stockLevel | Decimal |
| netPurchasePrice | Decimal |
| minimumPurchaseQuantity | Int |
| deliveryTimeInDays | Int |
| isDropshippingActive | Boolean |
| packageUnitDescription | String |
| packageUnitQuantity | Decimal |
| notes | String |
| vatRate | Decimal |
| useSupplierDeliveryTime | Boolean |
| includeSupplierStock | Boolean |
| purchaseInterval | Decimal |
| scalePrices | Object |

## ItemSupplierListItem

| Field | Type |
|-------|------|
| id | ID |
| itemId | ID |
| supplierId | ID |
| supplierName | String |
| supplierItemName | String |
| supplierItemNumber | String |
| deliveryPeriod | String |
| supplierCurrency | String |
| isDropshippingSupported | Boolean |
| isDropshippingActive | Boolean |
| isDefaultSupplier | Boolean |
| isDefaultDropshippingSupplier | Boolean |
| minimumPurchaseQuantity | Int |
| stockLevel | Decimal |
| averageDeliveryTime | Decimal |
| stockLevelLastModified | DateTime |
| includeSupplierStock | Boolean |
| supplierDeliveryTimeInDays | Int |
| deliveryTimeInDays | Int |
| useSupplierDeliveryTime | Boolean |
| packageUnitDescription | String |
| packageUnitQuantity | Decimal |
| notes | String |
| purchaseInterval | Decimal |
| netPurchasePrice | Decimal |
| vatRate | Decimal |
| scalePrices | Object |

## ItemSupplierPriceListItem

| Field | Type |
|-------|------|
| fromQuantity | Decimal |
| netPrice | Decimal |
| usePercentageDiscount | Boolean |
| percentageDiscount | Decimal |

## ItemSuppliers

| Field | Type |
|-------|------|
| defaultSupplier | ID |
| defaultDropshippingSupplier | ID |
| suppliers | Object |

## ItemTypeListItem

| Field | Type |
|-------|------|
| id | ID |
| isStockItem | Boolean |
| hasStock | Boolean |
| isSerialNumberItem | Boolean |
| isDivisibleStock | Boolean |
| stockHasExpirationDate | Boolean |
| stockIsBatch | Boolean |
| isBillOfMaterials | Boolean |
| isBillOfMaterialsComponent | Boolean |
| isVariationCombinationParent | Boolean |
| isVariationCombinationChild | Boolean |
| hasVariations | Boolean |
| isVoucher | Boolean |
| isPackaging | Boolean |
| hasConfigurationGroup | Boolean |
| isConfigurationComponent | Boolean |

## ItemUnitPricing

| Field | Type |
|-------|------|
| salesUnitId | ID |
| packagingUnitId | ID |
| innerQuantity | Decimal |
| innerQuantityUnitId | ID |
| isBasePriceDeclared | Boolean |
| basePriceReferenceUnitId | ID |
| basePriceReferenceAmount | Decimal |

## ItemVariations

| Field | Type |
|-------|------|
| variations | Object |

## ItemdetailsItem

| Field | Type |
|-------|------|
| id | ID |
| productGroupId | ID |
| shippingClassId | ID |
| manufacturerId | ID |
| identifiers | ItemIdentifiers |
| categories | ItemCategories |
| descriptions | ItemDescriptions |
| prices | ItemPrices |
| images | ItemImages |
| measurements | ItemMeasurements |
| customFields | ItemCustomFields |
| suppliers | ItemSuppliers |
| includeInPriceList | Boolean |
| ignoreOrderSuggestions | Boolean |
| ignoreDiscounts | Boolean |
| countryOfOrigin | String |
| notes | String |
| variations | ItemVariations |
| features | ItemFeatures |
| attributes | ItemAttributes |
| unitPricing | ItemUnitPricing |
| specialPrices | ItemSpecialPrices |
| storageConstraints | ItemStorageConstraints |

## LanguageItem

| Field | Type |
|-------|------|
| cultureIso | String |
| languageIso2 | String |
| languageIso3 | String |
| name | String |
| isDefault | Boolean |

## LotSize

| Field | Type |
|-------|------|
| id | ID |
| productionItemId | ID |
| quantity | Int |

## ManufacturerListItem

| Field | Type |
|-------|------|
| id | ID |
| sortNumber | Int |
| name | String |

## MarketplaceExternalDocumentListItem

| Field | Type |
|-------|------|
| invoiceId | ID |
| creditNoteId | ID |
| salesOrderId | ID |
| documentType | MarketplaceExternalDocumentType |
| origin | MarketplaceExternalDocumentOrigin |
| shopName | String |
| invoiceDate | DateTime |
| externalSalesOrderNumber | String |
| grossTotal | Decimal |
| documentFileId | ID |
| documentNumber | String |
| sellerId | ID |
| currency | String |

## MarketplaceNotificationDetailListItem

| Field | Type |
|-------|------|
| id | ID |
| notificationId | ID |
| code | String |
| message | String |

## MarketplaceNotificationListItem

| Field | Type |
|-------|------|
| id | ID |
| referenceId | ID |
| eventId | String |
| creationDate | DateTime |
| severity | MarketplaceNotificationSeverity |
| notificationType | MarketplaceNotificationType |
| reference | String |
| isRead | Boolean |
| shopId | ID |
| orderCancellationRequestId | String |
| shortMessage | String |
| channel | String |
| shopName | String |
| offerTitle | String |

## MarketplaceOfferListItem

| Field | Type |
|-------|------|
| offerId | ID |
| itemId | ID |
| sku | String |
| productNumber | String |
| offerTitle | String |
| channelName | String |
| channelId | ID |
| channel | String |
| shopId | ID |
| shopScxId | ID |
| quantity | Decimal |
| expirationDate | DateTime |
| categoryId | ID |
| channelCategoryId | String |
| channelCategoryName | String |
| netPrice | Decimal |
| percent | Decimal |
| priceId | ID |
| customerGroupId | ID |
| salePriceNet | Decimal |
| taxClassId | ID |
| companyId | ID |
| currency | String |
| availableQuantity | Decimal |
| quantityInOrders | Decimal |
| inboundQuantity | Decimal |
| gtin | String |
| productWeight | Decimal |
| mpn | String |
| isbn | String |
| asin | String |
| manufacturer | String |
| purchasePriceNet | Decimal |
| activeSince | DateTime |
| processingTime | Int |
| inboundAvailableAt | DateTime |
| offerType | MarketplaceOfferType |
| offerStatus | MarketplaceOfferViewStatus |
| listingUrl | String |
| isListed | Boolean |
| salesChannelItemDataId | Int |
| minimumStock | Decimal |
| maximumStock | Decimal |
| lastUpload | DateTime |
| deletionIntervalPendingOffer | Int |
| shopName | String |
| isExtern | Boolean |
| quantityUpdatedAt | DateTime |
| priceUpdatedAt | DateTime |
| statusReceivedAt | DateTime |
| lastUploadedPrice | Decimal |
| stockUpdateEnabled | Boolean |
| channelOfferId | String |

## MarketplaceOrderCancellationRequestUploadListItem

| Field | Type |
|-------|------|
| id | ID |
| orderId | ID |
| shopId | ID |
| sellerId | ID |
| shopName | String |
| salesOrderNumber | String |
| salesChannelDisplayName | String |
| externalSalesOrderNumber | String |
| salesOrderId | ID |
| createdAt | DateTime |
| uploadCountRemaining | Int |
| status | MarketplaceOrderCancellationRequestUploadStatus |
| uploadCount | Byte |

## MarketplaceOrderCancellationUploadListItem

| Field | Type |
|-------|------|
| id | ID |
| shopId | ID |
| sellerId | ID |
| shopName | String |
| cancellationUploadRequired | Boolean |
| salesOrderNumber | String |
| externalSalesOrderNumber | String |
| salesChannelDisplayName | String |
| salesOrderGrossAmount | Decimal |
| createdAt | DateTime |
| salesOrderId | ID |
| cancellationUploadCount | Int |
| cancellationUploadFailedAt | DateTime |
| uploadCountRemaining | Int |
| status | MarketplaceOrderCancellationUploadStatus |

## MarketplacePaymentUploadListItem

| Field | Type |
|-------|------|
| id | ID |
| shopId | ID |
| sellerId | ID |
| shopName | String |
| paymentUploadRequired | Boolean |
| salesOrderNumber | String |
| externalSalesOrderNumber | String |
| salesChannelDisplayName | String |
| salesOrderGrossAmount | Decimal |
| salesOrderPaymentGrossAmount | Decimal |
| createdAt | DateTime |
| salesOrderId | ID |
| paymentUploadCount | Int |
| paymentUploadFailedAt | DateTime |
| uploadCountRemaining | Int |
| status | MarketplacePaymentUploadStatus |

## MarketplaceReturnUploadLineItemListItem

| Field | Type |
|-------|------|
| id | ID |
| orderId | ID |
| returnId | ID |
| quantity | Decimal |
| creditNoteRequired | Boolean |
| sku | String |
| name | String |

## MarketplaceReturnUploadListItem

| Field | Type |
|-------|------|
| id | ID |
| shopId | ID |
| sellerId | ID |
| shopName | String |
| returnUploadRequired | Boolean |
| salesOrderNumber | String |
| externalSalesOrderNumber | String |
| returnNumber | String |
| salesChannelDisplayName | String |
| salesOrderGrossAmount | Decimal |
| createdAt | DateTime |
| salesOrderId | ID |
| returnUploadCount | Int |
| returnUploadFailedAt | DateTime |
| uploadCountRemaining | Int |
| status | MarketplaceReturnUploadStatus |
| creditNoteGrossAmount | Decimal |
| returnId | ID |

## MarketplaceShippingInformationUploadListItem

| Field | Type |
|-------|------|
| id | ID |
| deliveryNoteId | ID |
| orderId | ID |
| shopId | ID |
| sellerId | ID |
| salesOrderId | ID |
| shopName | String |
| salesChannelDisplayName | String |
| deliveryNoteNumber | String |
| salesOrderNumber | String |
| externalSalesOrderNumber | String |
| createdAt | DateTime |
| uploadFailedAt | DateTime |
| uploadCount | Byte |
| uploadCountRemaining | Int |
| status | MarketplaceShippingInformationUploadStatus |

## Mutation

| Field | Type |
|-------|------|
| DeleteBillOfMaterialsItem | Boolean |
| DeleteBillOfMaterialsOperation | Boolean |
| DeleteBillOfMaterials | Boolean |
| CreateBillOfMaterials | CreateBillOfMaterialsCommandResponse |
| CreateBillOfMaterialsItem | CreateBillOfMaterialsItemCommandResponse |
| CreateBillOfMaterialsOperation | CreateBillOfMaterialsOperationCommandResponse |
| CreateLotSize | CreateLotSizeCommandResponse |
| CreateProductionItem | CreateProductionItemCommandResponse |
| CreateProductionOrder | CreateProductionOrderCommandResponse |
| ReleaseProductionOrder | ReleaseProductionOrderCommandResponse |
| CreateWorkbenchResource | CreateWorkbenchResourceCommandResponse |
| CreateWorkbenchResourceType | CreateWorkbenchResourceTypeCommandResponse |
| CreateCategory | CreateCategoryCommandResponse |
| DeleteCategory | Boolean |
| UpdateCategory | UpdateCategoryCommandResponse |
| CopyItemdetails | CopyItemdetailsCommandResponse |
| DuplicateItems | DuplicateItemsCommandResponse |
| AddItemSupplier | AddItemSupplierCommandResponse |
| AddItemVariation | AddItemVariationCommandResponse |
| AddItemVariationValue | AddItemVariationValueCommandResponse |
| ChangeItem | ChangeItemCommandResponse |
| CreateItem | CreateItemCommandResponse |
| DeleteItemVariation | DeleteItemVariationCommandResponse |
| DeleteItemVariationValue | DeleteItemVariationValueCommandResponse |
| AddProductGroups | Boolean |
| DeleteProductGroups | Boolean |
| UpdateProductGroups | Boolean |
| UpdateItemSalesChannels | Boolean |
| CreateShippingClass | CreateShippingClassCommandResponse |
| CreateCustomer | CreateCustomerCommandResponse |
| UpdateCustomer | UpdateCustomerCommandResponse |
| ExcludeMarketplaceInvoiceCorrectionFromUpload | Boolean |
| ExcludeMarketplaceInvoicePdfFromUpload | Boolean |
| ResetMarketplaceInvoiceCorrectionUploadCounter | Boolean |
| ResetMarketplaceInvoicePdfPrinting | Boolean |
| DeleteMarketplaceOffer | Boolean |
| SetMarketplaceOfferMaxQuantity | Boolean |
| SetMarketplaceOfferMinQuantity | Boolean |
| TriggerMarketplaceStockSynchronisation | Boolean |
| ExcludeMarketplaceOrderCancellationUploadFromUpload | Boolean |
| ExcludeMarketplaceReturnUploadFromUpload | Boolean |
| ExcludeMarketplaceShippingInformationUploadFromUpload | Boolean |
| ResetMarketplaceOrderCancellationUploadCounter | Boolean |
| ResetMarketplaceReturnUploadCounter | Boolean |
| ActivateLanguage | Boolean |
| DeactivateLanguage | Boolean |
| CreateTaxClass | ID |
| CreateTaxCode | ID |
| DeleteTaxClass | Boolean |
| DeleteTaxCode | Boolean |
| UpdateTaxClass | Boolean |
| UpdateTaxCode | Boolean |
| CancelSalesInvoiceCorrection | Boolean |
| CreateSalesInvoiceCorrection | CreateSalesInvoiceCorrectionCommandResponse |
| CancelSalesInvoice | Boolean |
| CreateSalesInvoice | CreateSalesInvoiceCommandResponse |
| CalculateSalesOrder | CalculateSalesOrderCommandResponse |
| CreateSalesOrder | CreateSalesOrderCommandResponse |
| UpdateSalesOrder | UpdateSalesOrderCommandResponse |
| CancelSalesQuotation | Boolean |
| CreateSalesOrderFromSalesQuotation | CreateSalesOrderFromSalesQuotationCommandResponse |
| CreateSalesQuotation | CreateSalesQuotationCommandResponse |
| ChangePackageWeight | Boolean |
| CreateDeliverPackage | Boolean |
| AssignShippingBoxToLocation | Boolean |
| CreateShippingBox | CreateShippingBoxCommandResponse |
| DeleteShippingBox | Boolean |
| UpdateShippingBoxMetadata | Boolean |
| ActivateBinLocation | Boolean |
| CreateBinLocation | CreateBinLocationCommandResponse |
| DeactivateBinLocation | Boolean |
| DeleteBinLocation | Boolean |
| LockBinLocation | Boolean |
| LockBinLocationForAvailableStock | Boolean |
| UnlockBinLocationForAvailableStock | Boolean |
| UpdateBinLocationMetadata | Boolean |
| AddBinLocationsToZone | Boolean |
| CreateWarehouseZone | CreateWarehouseZoneCommandResponse |
| DeleteWarehouseZone | Boolean |
| RemoveBinLocationsFromZone | Boolean |
| UpdateWarehouseZoneMetadata | Boolean |

## NegativeStockPlatform

| Field | Type |
|-------|------|
| platformId | ID |
| isNegativeStockAllowed | Boolean |

## NegativeStockSalesChannel

| Field | Type |
|-------|------|
| salesChannelId | ID |
| isNegativeStockAllowed | Boolean |

## OrderDataItem

| Field | Type |
|-------|------|
| id | String |
| totalWeight | Decimal |
| orderId | ID |
| customerId | ID |
| companyId | ID |
| warehouseId | ID |
| shippingAddress | ShippingAddress |
| companyAddress | CompanyAddress |
| warehouseAddress | WarehouseAddress |
| deliveryNotes | Object |
| content | Object |

## PackageContent

| Field | Type |
|-------|------|
| id | ID |
| number | String |
| contentType | String |
| amount | Decimal |
| weight | Decimal |

## PageInfo

| Field | Type |
|-------|------|
| hasNextPage | Int |
| hasPreviousPage | Int |
| startCursor | String |
| endCursor | String |

## PaymentMethod

| Field | Type |
|-------|------|
| id | ID |
| name | String |
| generalLedgerAccount | String |
| isActive | Boolean |
| isDefault | Boolean |
| isDebit | Boolean |
| isDunningActive | Boolean |
| canShipBeforePayment | Boolean |
| cashDiscountDays | Int |
| cashDiscountValue | Decimal |
| paymentOption | String |

## PickList

| Field | Type |
|-------|------|
| id | ID |
| pickListNumber | String |
| status | Int |
| warehouseId | ID |
| positions | Object |

## PickListPosition

| Field | Type |
|-------|------|
| positionId | ID |
| itemId | ID |
| itemNumber | String |
| quantity | Decimal |
| binLocationId | ID |
| binLocationName | String |
| positionStatus | Int |
| processingTimestamp | DateTime |

## PlatformDescription

| Field | Type |
|-------|------|
| platformId | ID |
| languageIso | String |
| descriptionData | DescriptionData |

## PlatformImages

| Field | Type |
|-------|------|
| platformId | ID |
| images | Object |

## ProductGroupsListItem

| Field | Type |
|-------|------|
| id | ID |
| name | String |

## ProductionItem

| Field | Type |
|-------|------|
| id | ID |
| itemId | ID |
| lotType | LotType |
| productionType | ProductionType |
| lotLabelTemplateKey | ID |
| singleItemLabelTemplateKey | ID |
| createDate | DateTime |
| updateDate | DateTime |
| updateUserId | ID |

## ProductionOrder

| Field | Type |
|-------|------|
| id | ID |
| productionItemId | ID |
| billOfMaterialId | ID |
| dispositionId | ID |
| lotCount | Int |
| lotSize | Decimal |
| targetTotalQuantity | Decimal |
| actualQuantity | Decimal |
| isTargetTotalQuantityBelowLotSizeAllowed | Boolean |
| progress | Decimal |
| targetStartTimestamp | DateTime |
| targetCompletionTimestamp | DateTime |
| actualStartTimestamp | DateTime |
| actualCompletionTimestamp | DateTime |
| projectNumber | String |
| referenceNumber | String |
| issueNumber | String |
| issueDate | DateTime |
| notice | String |
| releaseTimestamp | DateTime |
| deliveryTimestamp | DateTime |
| creationUserId | ID |
| releaseUserId | ID |
| lastModificationUserId | ID |
| lastModificationTimestamp | DateTime |
| resourceTypeId | ID |
| workbenchResourceId | ID |

## Query

| Field | Type |
|-------|------|
| QueryBillOfMaterialsItemById | BillOfMaterialsItem |
| QueryBillOfMaterialsItemsByBillOfMaterialsId | Object |
| QueryBillOfMaterialsItemsByBillOfMaterialsOperationId | Object |
| QueryBillOfMaterialsOperationById | BillOfMaterialsOperation |
| QueryBillOfMaterialsOperationsByBillOfMaterialsId | Object |
| QueryBillOfMaterialsById | BillOfMaterials |
| QueryBillsOfMaterialsByProductionItemId | QueryBillsOfMaterialsByProductionItemIdConnection |
| QueryLotSizeById | LotSize |
| QueryLotSizesByProductionItemId | QueryLotSizesByProductionItemIdConnection |
| QueryProductionItems | QueryProductionItemsConnection |
| QueryProductionItemById | ProductionItem |
| QueryProductionItemByItemId | ProductionItem |
| QueryProductionOrders | QueryProductionOrdersConnection |
| QueryProductionOrderById | ProductionOrder |
| QueryResourceCategories | QueryResourceCategoriesConnection |
| QueryWorkbenchResources | QueryWorkbenchResourcesConnection |
| QueryWorkbenchResourceById | WorkbenchResource |
| QueryWorkbenchResourceTypes | QueryWorkbenchResourceTypesConnection |
| QueryWorkbenchResourceTypeById | WorkbenchResourceType |
| GetCategoryById | CategoryDetails |
| QueryCategories | QueryCategoriesConnection |
| GetCompanyById | CompanyDetailsItem |
| QueryCompanies | QueryCompaniesConnection |
| QueryCustomFields | QueryCustomFieldsConnection |
| GetItemById | ItemdetailsItem |
| QueryItems | QueryItemsConnection |
| GetItemSuppliersById | GetItemSuppliersByIdConnection |
| QueryItemTypes | QueryItemTypesConnection |
| QueryManufacturers | QueryManufacturersConnection |
| QueryProductGroups | QueryProductGroupsConnection |
| QueryShippingClasses | QueryShippingClassesConnection |
| GetCustomerById | Customer |
| QueryCustomerCategories | QueryCustomerCategoriesConnection |
| QueryCustomerGroups | QueryCustomerGroupsConnection |
| QueryCustomers | QueryCustomersConnection |
| QueryMarketplaceNotificationDetail | QueryMarketplaceNotificationDetailConnection |
| QueryMarketplaceNotification | QueryMarketplaceNotificationConnection |
| QueryMarketplaceOffer | QueryMarketplaceOfferConnection |
| QueryMarketplaceExternalDocument | QueryMarketplaceExternalDocumentConnection |
| QueryMarketplaceOrderCancellationRequestUpload | QueryMarketplaceOrderCancellationRequestUploadConnection |
| QueryMarketplaceOrderCancellationUpload | QueryMarketplaceOrderCancellationUploadConnection |
| QueryMarketplacePaymentUpload | QueryMarketplacePaymentUploadConnection |
| QueryMarketplaceReturnUploadLineItem | QueryMarketplaceReturnUploadLineItemConnection |
| QueryMarketplaceReturnUpload | QueryMarketplaceReturnUploadConnection |
| QueryMarketplaceShippingInformationUpload | QueryMarketplaceShippingInformationUploadConnection |
| QueryShippingMethods | QueryShippingMethodsConnection |
| QueryCountries | QueryCountriesConnection |
| QueryLanguages | QueryLanguagesConnection |
| QueryTaxClasses | QueryTaxClassesConnection |
| ListTaxClassesWithTaxRates | Object |
| QueryTaxCodes | QueryTaxCodesConnection |
| QueryCurrencies | QueryCurrenciesConnection |
| QueryExternalDocumentsInternal | QueryExternalDocumentsInternalConnection |
| QueryExternalDocumentLineItemsInternal | QueryExternalDocumentLineItemsInternalConnection |
| QuerySalesInvoiceCorrectionsInternal | QuerySalesInvoiceCorrectionsInternalConnection |
| QuerySalesInvoiceCorrectionLineItemsInternal | QuerySalesInvoiceCorrectionLineItemsInternalConnection |
| QuerySalesInvoicesInternal | QuerySalesInvoicesInternalConnection |
| QuerySalesInvoiceLineItemsInternal | QuerySalesInvoiceLineItemsInternalConnection |
| QuerySalesInvoiceCancellationsInternal | QuerySalesInvoiceCancellationsInternalConnection |
| QueryPaymentMethods | QueryPaymentMethodsConnection |
| QuerySalesChannels | QuerySalesChannelsConnection |
| QuerySalesInvoiceCorrections | QuerySalesInvoiceCorrectionsConnection |
| QuerySalesInvoiceCancellationReasons | QuerySalesInvoiceCancellationReasonsConnection |
| QuerySalesInvoices | QuerySalesInvoicesConnection |
| GetEmptySalesOrder | EmptySalesOrder |
| ListItemPriceDetails | Object |
| GetSalesOrderById | SalesOrder |
| QuerySalesOrders | QuerySalesOrdersConnection |
| GetSalesQuotationById | SalesQuotation |
| QuerySalesQuotations | QuerySalesQuotationsConnection |
| QuerySuppliers | QuerySuppliersConnection |
| QueryPicklists | QueryPicklistsConnection |
| QueryOrderData | OrderDataItem |
| QueryBatches | QueryBatchesConnection |
| QueryBestBeforeDates | QueryBestBeforeDatesConnection |
| QueryStockReservations | QueryStockReservationsConnection |
| QuerySerialNumbers | QuerySerialNumbersConnection |
| QueryStockItem | QueryStockItemConnection |
| QueryStock | QueryStockConnection |
| QueryBinLocationPickHeatmap | QueryBinLocationPickHeatmapConnection |
| QueryShippingBoxes | QueryShippingBoxesConnection |
| QueryShippingBoxTypes | QueryShippingBoxTypesConnection |
| QueryBinLocations | QueryBinLocationsConnection |
| GetBinLocationById | BinLocationListItem |
| QueryBinLocationOccupancy | QueryBinLocationOccupancyConnection |
| GetBinLocationStatuses | Object |
| GetBinLocationTypes | Object |
| QueryStockMovementHistory | QueryStockMovementHistoryConnection |
| QueryWarehouseZones | QueryWarehouseZonesConnection |
| QueryZoneBinLocations | QueryZoneBinLocationsConnection |
| QueryZoneTypes | QueryZoneTypesConnection |
| QueryStorageLocations | QueryStorageLocationsConnection |
| QueryWarehouses | QueryWarehousesConnection |

## QueryBatchesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryBatchesEdge |
| nodes | BatchListItem |
| totalCount | Int |

## QueryBatchesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | BatchListItem |

## QueryBestBeforeDatesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryBestBeforeDatesEdge |
| nodes | BestBeforeListItem |
| totalCount | Int |

## QueryBestBeforeDatesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | BestBeforeListItem |

## QueryBillsOfMaterialsByProductionItemIdConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryBillsOfMaterialsByProductionItemIdEdge |
| nodes | BillOfMaterials |
| totalCount | Int |

## QueryBillsOfMaterialsByProductionItemIdEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | BillOfMaterials |

## QueryBinLocationOccupancyConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryBinLocationOccupancyEdge |
| nodes | BinLocationOccupancyItem |
| totalCount | Int |

## QueryBinLocationOccupancyEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | BinLocationOccupancyItem |

## QueryBinLocationPickHeatmapConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryBinLocationPickHeatmapEdge |
| nodes | BinLocationPickHeatmapItem |
| totalCount | Int |

## QueryBinLocationPickHeatmapEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | BinLocationPickHeatmapItem |

## QueryBinLocationsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryBinLocationsEdge |
| nodes | BinLocationListItem |
| totalCount | Int |

## QueryBinLocationsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | BinLocationListItem |

## QueryCategoriesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryCategoriesEdge |
| nodes | CategoryListItem |
| totalCount | Int |

## QueryCategoriesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | CategoryListItem |

## QueryCompaniesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryCompaniesEdge |
| nodes | CompanyListItem |
| totalCount | Int |

## QueryCompaniesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | CompanyListItem |

## QueryCountriesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryCountriesEdge |
| nodes | CountryItem |
| totalCount | Int |

## QueryCountriesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | CountryItem |

## QueryCurrenciesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryCurrenciesEdge |
| nodes | Currency |
| totalCount | Int |

## QueryCurrenciesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | Currency |

## QueryCustomFieldsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryCustomFieldsEdge |
| nodes | CustomFieldListItem |
| totalCount | Int |

## QueryCustomFieldsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | CustomFieldListItem |

## QueryCustomerCategoriesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryCustomerCategoriesEdge |
| nodes | CustomerCategory |
| totalCount | Int |

## QueryCustomerCategoriesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | CustomerCategory |

## QueryCustomerGroupsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryCustomerGroupsEdge |
| nodes | CustomerGroup |
| totalCount | Int |

## QueryCustomerGroupsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | CustomerGroup |

## QueryCustomersConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryCustomersEdge |
| nodes | CustomerListItem |
| totalCount | Int |

## QueryCustomersEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | CustomerListItem |

## QueryExternalDocumentLineItemsInternalConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryExternalDocumentLineItemsInternalEdge |
| nodes | ExternalDocumentLineItemInternal |
| totalCount | Int |

## QueryExternalDocumentLineItemsInternalEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ExternalDocumentLineItemInternal |

## QueryExternalDocumentsInternalConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryExternalDocumentsInternalEdge |
| nodes | ExternalDocumentInternal |
| totalCount | Int |

## QueryExternalDocumentsInternalEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ExternalDocumentInternal |

## QueryItemTypesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryItemTypesEdge |
| nodes | ItemTypeListItem |
| totalCount | Int |

## QueryItemTypesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ItemTypeListItem |

## QueryItemsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryItemsEdge |
| nodes | ItemListItem |
| totalCount | Int |

## QueryItemsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ItemListItem |

## QueryLanguagesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryLanguagesEdge |
| nodes | LanguageItem |
| totalCount | Int |

## QueryLanguagesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | LanguageItem |

## QueryLotSizesByProductionItemIdConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryLotSizesByProductionItemIdEdge |
| nodes | LotSize |
| totalCount | Int |

## QueryLotSizesByProductionItemIdEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | LotSize |

## QueryManufacturersConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryManufacturersEdge |
| nodes | ManufacturerListItem |
| totalCount | Int |

## QueryManufacturersEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ManufacturerListItem |

## QueryMarketplaceExternalDocumentConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryMarketplaceExternalDocumentEdge |
| nodes | MarketplaceExternalDocumentListItem |
| totalCount | Int |

## QueryMarketplaceExternalDocumentEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | MarketplaceExternalDocumentListItem |

## QueryMarketplaceNotificationConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryMarketplaceNotificationEdge |
| nodes | MarketplaceNotificationListItem |
| totalCount | Int |

## QueryMarketplaceNotificationDetailConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryMarketplaceNotificationDetailEdge |
| nodes | MarketplaceNotificationDetailListItem |
| totalCount | Int |

## QueryMarketplaceNotificationDetailEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | MarketplaceNotificationDetailListItem |

## QueryMarketplaceNotificationEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | MarketplaceNotificationListItem |

## QueryMarketplaceOfferConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryMarketplaceOfferEdge |
| nodes | MarketplaceOfferListItem |
| totalCount | Int |

## QueryMarketplaceOfferEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | MarketplaceOfferListItem |

## QueryMarketplaceOrderCancellationRequestUploadConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryMarketplaceOrderCancellationRequestUploadEdge |
| nodes | MarketplaceOrderCancellationRequestUploadListItem |
| totalCount | Int |

## QueryMarketplaceOrderCancellationRequestUploadEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | MarketplaceOrderCancellationRequestUploadListItem |

## QueryMarketplaceOrderCancellationUploadConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryMarketplaceOrderCancellationUploadEdge |
| nodes | MarketplaceOrderCancellationUploadListItem |
| totalCount | Int |

## QueryMarketplaceOrderCancellationUploadEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | MarketplaceOrderCancellationUploadListItem |

## QueryMarketplacePaymentUploadConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryMarketplacePaymentUploadEdge |
| nodes | MarketplacePaymentUploadListItem |
| totalCount | Int |

## QueryMarketplacePaymentUploadEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | MarketplacePaymentUploadListItem |

## QueryMarketplaceReturnUploadConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryMarketplaceReturnUploadEdge |
| nodes | MarketplaceReturnUploadListItem |
| totalCount | Int |

## QueryMarketplaceReturnUploadEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | MarketplaceReturnUploadListItem |

## QueryMarketplaceReturnUploadLineItemConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryMarketplaceReturnUploadLineItemEdge |
| nodes | MarketplaceReturnUploadLineItemListItem |
| totalCount | Int |

## QueryMarketplaceReturnUploadLineItemEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | MarketplaceReturnUploadLineItemListItem |

## QueryMarketplaceShippingInformationUploadConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryMarketplaceShippingInformationUploadEdge |
| nodes | MarketplaceShippingInformationUploadListItem |
| totalCount | Int |

## QueryMarketplaceShippingInformationUploadEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | MarketplaceShippingInformationUploadListItem |

## QueryPaymentMethodsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryPaymentMethodsEdge |
| nodes | PaymentMethod |
| totalCount | Int |

## QueryPaymentMethodsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | PaymentMethod |

## QueryPicklistsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryPicklistsEdge |
| nodes | PickList |
| totalCount | Int |

## QueryPicklistsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | PickList |

## QueryProductGroupsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryProductGroupsEdge |
| nodes | ProductGroupsListItem |
| totalCount | Int |

## QueryProductGroupsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ProductGroupsListItem |

## QueryProductionItemsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryProductionItemsEdge |
| nodes | ProductionItem |
| totalCount | Int |

## QueryProductionItemsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ProductionItem |

## QueryProductionOrdersConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryProductionOrdersEdge |
| nodes | ProductionOrder |
| totalCount | Int |

## QueryProductionOrdersEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ProductionOrder |

## QueryResourceCategoriesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryResourceCategoriesEdge |
| nodes | ResourceCategory |
| totalCount | Int |

## QueryResourceCategoriesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ResourceCategory |

## QuerySalesChannelsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySalesChannelsEdge |
| nodes | SalesChannel |
| totalCount | Int |

## QuerySalesChannelsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | SalesChannel |

## QuerySalesInvoiceCancellationReasonsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySalesInvoiceCancellationReasonsEdge |
| nodes | SalesInvoiceCancellationReason |
| totalCount | Int |

## QuerySalesInvoiceCancellationReasonsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | SalesInvoiceCancellationReason |

## QuerySalesInvoiceCancellationsInternalConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySalesInvoiceCancellationsInternalEdge |
| nodes | SalesInvoiceCancellationInternal |
| totalCount | Int |

## QuerySalesInvoiceCancellationsInternalEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | SalesInvoiceCancellationInternal |

## QuerySalesInvoiceCorrectionLineItemsInternalConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySalesInvoiceCorrectionLineItemsInternalEdge |
| nodes | SalesInvoiceCorrectionLineItemInternal |
| totalCount | Int |

## QuerySalesInvoiceCorrectionLineItemsInternalEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | SalesInvoiceCorrectionLineItemInternal |

## QuerySalesInvoiceCorrectionsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySalesInvoiceCorrectionsEdge |
| nodes | SalesInvoiceCorrectionListItem |
| totalCount | Int |

## QuerySalesInvoiceCorrectionsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | SalesInvoiceCorrectionListItem |

## QuerySalesInvoiceCorrectionsInternalConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySalesInvoiceCorrectionsInternalEdge |
| nodes | SalesInvoiceCorrectionInternal |
| totalCount | Int |

## QuerySalesInvoiceCorrectionsInternalEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | SalesInvoiceCorrectionInternal |

## QuerySalesInvoiceLineItemsInternalConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySalesInvoiceLineItemsInternalEdge |
| nodes | SalesInvoiceLineItemInternal |
| totalCount | Int |

## QuerySalesInvoiceLineItemsInternalEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | SalesInvoiceLineItemInternal |

## QuerySalesInvoicesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySalesInvoicesEdge |
| nodes | SalesInvoiceListItem |
| totalCount | Int |

## QuerySalesInvoicesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | SalesInvoiceListItem |

## QuerySalesInvoicesInternalConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySalesInvoicesInternalEdge |
| nodes | SalesInvoiceInternal |
| totalCount | Int |

## QuerySalesInvoicesInternalEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | SalesInvoiceInternal |

## QuerySalesOrdersConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySalesOrdersEdge |
| nodes | SalesOrderListItem |
| totalCount | Int |

## QuerySalesOrdersEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | SalesOrderListItem |

## QuerySalesQuotationsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySalesQuotationsEdge |
| nodes | SalesQuotationListItem |
| totalCount | Int |

## QuerySalesQuotationsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | SalesQuotationListItem |

## QuerySerialNumbersConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySerialNumbersEdge |
| nodes | SerialNumberListItem |
| totalCount | Int |

## QuerySerialNumbersEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | SerialNumberListItem |

## QueryShippingBoxTypesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryShippingBoxTypesEdge |
| nodes | ShippingBoxType |
| totalCount | Int |

## QueryShippingBoxTypesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ShippingBoxType |

## QueryShippingBoxesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryShippingBoxesEdge |
| nodes | ShippingBoxListItem |
| totalCount | Int |

## QueryShippingBoxesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ShippingBoxListItem |

## QueryShippingClassesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryShippingClassesEdge |
| nodes | ShippingClassListItem |
| totalCount | Int |

## QueryShippingClassesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ShippingClassListItem |

## QueryShippingMethodsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryShippingMethodsEdge |
| nodes | ShippingMethodLookupItem |
| totalCount | Int |

## QueryShippingMethodsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ShippingMethodLookupItem |

## QueryStock

| Field | Type |
|-------|------|
| stockEntryId | ID |
| warehouseId | ID |
| binLocationId | ID |
| articleId | ID |
| availableQuantity | Decimal |
| reservedQuantity | Decimal |
| batchNumber | String |
| bestBeforeDate | DateTime |
| serialNumber | String |

## QueryStockConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryStockEdge |
| nodes | QueryStock |
| totalCount | Int |

## QueryStockEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | QueryStock |

## QueryStockItem

| Field | Type |
|-------|------|
| storageLocationId | ID |
| itemId | ID |
| quantityTotal | Decimal |
| comment1 | String |
| comment2 | String |

## QueryStockItemConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryStockItemEdge |
| nodes | QueryStockItem |
| totalCount | Int |

## QueryStockItemEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | QueryStockItem |

## QueryStockMovementHistoryConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryStockMovementHistoryEdge |
| nodes | StockMovementHistoryItem |
| totalCount | Int |

## QueryStockMovementHistoryEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | StockMovementHistoryItem |

## QueryStockReservationsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryStockReservationsEdge |
| nodes | StockReservationListItem |
| totalCount | Int |

## QueryStockReservationsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | StockReservationListItem |

## QueryStorageLocationsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryStorageLocationsEdge |
| nodes | StorageLocationListItem |
| totalCount | Int |

## QueryStorageLocationsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | StorageLocationListItem |

## QuerySuppliersConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QuerySuppliersEdge |
| nodes | Supplier |
| totalCount | Int |

## QuerySuppliersEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | Supplier |

## QueryTaxClassesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryTaxClassesEdge |
| nodes | TaxClass |
| totalCount | Int |

## QueryTaxClassesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | TaxClass |

## QueryTaxCodesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryTaxCodesEdge |
| nodes | TaxCode |
| totalCount | Int |

## QueryTaxCodesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | TaxCode |

## QueryWarehouseZonesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryWarehouseZonesEdge |
| nodes | WarehouseZoneListItem |
| totalCount | Int |

## QueryWarehouseZonesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | WarehouseZoneListItem |

## QueryWarehousesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryWarehousesEdge |
| nodes | WarehouseListItem |
| totalCount | Int |

## QueryWarehousesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | WarehouseListItem |

## QueryWorkbenchResourceTypesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryWorkbenchResourceTypesEdge |
| nodes | WorkbenchResourceType |
| totalCount | Int |

## QueryWorkbenchResourceTypesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | WorkbenchResourceType |

## QueryWorkbenchResourcesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryWorkbenchResourcesEdge |
| nodes | WorkbenchResource |
| totalCount | Int |

## QueryWorkbenchResourcesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | WorkbenchResource |

## QueryZoneBinLocationsConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryZoneBinLocationsEdge |
| nodes | ZoneBinLocationItem |
| totalCount | Int |

## QueryZoneBinLocationsEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ZoneBinLocationItem |

## QueryZoneTypesConnection

| Field | Type |
|-------|------|
| pageInfo | PageInfo |
| edges | QueryZoneTypesEdge |
| nodes | ZoneType |
| totalCount | Int |

## QueryZoneTypesEdge

| Field | Type |
|-------|------|
| cursor | String |
| node | ZoneType |

## ReleaseProductionOrderCommandResponse

| Field | Type |
|-------|------|
| result | ReleaseProductionOrderCommandResult |

## ReleaseProductionOrderCommandResult

| Field | Type |
|-------|------|
| releaseTimestamp | DateTime |
| releaseUserId | ID |

## ResourceCategory

| Field | Type |
|-------|------|
| id | ID |
| name | String |
| isVisible | Boolean |
| isEnabled | Boolean |

## SalesChannel

| Field | Type |
|-------|------|
| id | ID |
| name | String |

## SalesChannelDescription

| Field | Type |
|-------|------|
| salesChannelId | ID |
| languageIso | String |
| descriptionData | DescriptionData |

## SalesChannelSurcharge

| Field | Type |
|-------|------|
| salesChannelId | ID |
| surcharges | Object |

## SalesInvoiceCancellationInternal

| Field | Type |
|-------|------|
| salesOrderId | ID |
| salesInvoiceId | ID |
| companyId | ID |
| customerId | ID |
| platformId | ID |
| salesInvoiceNumber | String |
| salesInvoiceCancellationDate | DateTime |
| externalOrderNumber | String |
| salesOrderNumber | String |
| createdInErpDate | DateTime |
| taxSetting | Int |
| currencyIso | String |
| currencyFactor | Decimal |
| departureCountryCurrencyIso | String |
| departureCountryCurrencyFactor | Decimal |
| serviceDate | DateTime |
| lastShippingDate | DateTime |
| platformName | String |
| shippingMethodId | ID |
| valueDate | DateTime |
| customerVatIdNumber | String |
| salesInvoiceVatIdNumber | String |
| departureCountryIso | String |
| totalGrossAmount | Decimal |
| totalNetAmount | Decimal |
| salesInvoiceCustomerNumber | String |
| accountsReceivableNumber | Int |
| paymentDueDateInDays | Int |
| paymentStatus | Int |
| invoicePaymentMethodId | ID |
| paymentMethodId | ID |
| paymentMethodName | String |
| salesOrderDepartureCountryCurrencyIso | String |
| salesOrderDepartureCountryCurrencyFactor | Decimal |
| shipmentAddressCompany | String |
| shipmentAddressSalutation | String |
| shipmentAddressTitle | String |
| shipmentAddressFirstName | String |
| shipmentAddressLastName | String |
| shipmentAddressStreet | String |
| shipmentAddressPostalCode | String |
| shipmentAddressCity | String |
| shipmentAddressCountry | String |
| shipmentAddressPhoneNumber | String |
| shipmentAddressFaxNumber | String |
| shipmentAddressAdditionalAddressLine | String |
| shipmentAddressCountryIso | String |
| shipmentAddressVatIdNumber | String |
| billingAddressCompany | String |
| billingAddressSalutation | String |
| billingAddressTitle | String |
| billingAddressFirstName | String |
| billingAddressLastName | String |
| billingAddressStreet | String |
| billingAddressPostalCode | String |
| billingAddressCity | String |
| billingAddressCountry | String |
| billingAddressPhoneNumber | String |
| billingAddressFaxNumber | String |
| billingAddressAdditionalAddressLine | String |
| billingAddressCountryIso | String |
| customerDefaultBillingAddressCompany | String |
| customerDefaultBillingAddressSalutation | String |
| customerDefaultBillingAddressTitle | String |
| customerDefaultBillingAddressFirstName | String |
| customerDefaultBillingAddressLastName | String |
| customerDefaultBillingAddressStreet | String |
| customerDefaultBillingAddressPostalCode | String |
| customerDefaultBillingAddressCity | String |
| customerDefaultBillingAddressCountry | String |
| customerDefaultBillingAddressPhoneNumber | String |
| customerDefaultBillingAddressFaxNumber | String |
| customerDefaultBillingAddressCountryIso | String |
| customerDefaultBillingAddressEmailAddress | String |
| customerDefaultBillingAddressVatIdNumber | String |
| customerNumber | String |
| customerGroupId | ID |
| customerPaymentDueDateInDays | Int |
| deposit | String |
| dropShippingDeliveryNoteCount | Int |

## SalesInvoiceCancellationReason

| Field | Type |
|-------|------|
| id | ID |
| name | String |
| isCommentRequired | Boolean |

## SalesInvoiceCorrectionInternal

| Field | Type |
|-------|------|
| salesOrderId | ID |
| salesInvoiceCorrectionId | ID |
| customerId | ID |
| companyId | ID |
| salesInvoiceId | ID |
| platformId | ID |
| cancelledSalesInvoiceId | ID |
| salesInvoicePaymentMethodId | ID |
| salesInvoiceCorrectionPaymentMethodId | ID |
| salesInvoiceCorrectionNumber | String |
| salesInvoiceCorrectionDate | DateTime |
| salesInvoiceNumber | String |
| salesInvoiceDate | DateTime |
| externalOrderNumber | String |
| salesOrderNumber | String |
| createdInErpDate | DateTime |
| currencyIso | String |
| currencyFactor | Decimal |
| departureCountryCurrencyIso | String |
| departureCountryCurrencyFactor | Decimal |
| salesOrderDepartureCountryCurrencyIso | String |
| salesOrderDepartureCountryCurrencyFactor | Decimal |
| salesOrderShippingMethodId | ID |
| salesInvoiceShippingMethodId | ID |
| serviceDate | DateTime |
| deliveryDate | DateTime |
| totalGrossAmount | Decimal |
| salesOrderTotalGrossAmount | Decimal |
| salesOrderTotalNetAmount | Decimal |
| platformID | String |
| accountsReceivableNumber | Int |
| shipmentCompany | String |
| shipmentSalutation | String |
| shipmentTitle | String |
| shipmentFirstName | String |
| shipmentLastName | String |
| shipmentStreet | String |
| shipmentPostalCode | String |
| shipmentCity | String |
| shipmentCountry | String |
| shipmentPhoneNumber | String |
| shipmentFaxNumber | String |
| shipmentAdditionalAddressLine | String |
| shipmentCountryIso | String |
| shipmentVatIdNumber | String |
| salesOrderCustomerVatIdNumber | String |
| salesInvoiceCompany | String |
| salesInvoiceSalutation | String |
| salesInvoiceTitle | String |
| salesInvoiceFirstName | String |
| salesInvoiceLastName | String |
| salesInvoiceStreet | String |
| salesInvoicePostalCode | String |
| salesInvoiceCity | String |
| salesInvoiceCountry | String |
| salesInvoicePhoneNumber | String |
| salesInvoiceFaxNumber | String |
| salesInvoiceAdditionalAddressLine | String |
| salesInvoiceIso | String |
| customerCompany | String |
| customerSalutation | String |
| customerTitle | String |
| customerFirstName | String |
| customerLastName | String |
| customerStreet | String |
| customerPostalCode | String |
| customerCity | String |
| customerCountry | String |
| customerPhoneNumber | String |
| customerFaxNumber | String |
| customerAddressIso | String |
| customerAddressEmailAddress | String |
| customerAddressVatIdNumber | String |
| customerNumber | String |
| customerGroupId | ID |
| customerPaymentDueDateInDays | Int |
| lastShippingDate | DateTime |
| taxSetting | Int |
| salesOrderVatIdNumber | String |
| departureCountryIso | String |
| paymentMethod | String |
| customerVatIdNumber | String |
| salesInvoiceVatIdNumber | String |
| salesInvoiceCustomerNumber | String |
| paymentMethodName | String |
| paymentMethodId | ID |
| isCancelled | String |
| deposit | String |
| salesInvoiceId2 | ID |
| dropShippingDeliveryNoteCount | Int |

## SalesInvoiceCorrectionLineItemInternal

| Field | Type |
|-------|------|
| salesInvoiceCorrectionLineItemId | ID |
| salesOrderLineItemId | ID |
| salesPriceGross | Decimal |
| discount | Decimal |
| salesPriceNet | Decimal |
| quantity | Decimal |
| lineItemName | String |
| sku | String |
| taxRate | Decimal |
| salesOrderLineItemPurchasePriceNet | Decimal |
| itemPurchasePriceNet | Decimal |
| taxClassId | ID |
| lineItemType | Byte |
| itemId | ID |
| billOfMaterialsSalesOrderLineItemId | ID |
| parentItemId | ID |
| taric | String |
| itemWeight | Decimal |
| itemVolume | Decimal |
| productGroupId | ID |
| productGroupName | String |
| warehouseId | ID |
| salesInvoiceLineItemId | ID |

## SalesInvoiceCorrectionListItem

| Field | Type |
|-------|------|
| id | ID |
| salesInvoiceCorrectionNumber | String |
| salesInvoiceNumber | String |
| customerNumber | String |
| totalGrossAmount | Decimal |
| totalNetAmount | Decimal |
| revenueAccount | String |
| plattformId | ID |
| currencyIso | String |
| customerGroupName | String |
| salesInvoiceCorrectionDate | DateTime |
| printDate | DateTime |
| mailDate | DateTime |
| salesInvoiceComment | String |
| cancelledDate | DateTime |
| cancellationUserName | String |
| cancellationReason | String |
| cancellationComment | String |
| shortText | String |
| billingAddressCompany | String |
| billingAddressFirstName | String |
| billingAddressLastName | String |
| billingAddressStreet | String |
| billingAddressPostalCode | String |
| billingAddressCity | String |
| billingAddressCountryName | String |
| billingAddressPhoneNumber | String |
| billingAddressFax | String |
| billingAddressEmailAddress | String |
| billingAddressAdditionalCompanyLine | String |
| billingAddressAdditionalAddressLine | String |
| billingAddressState | String |
| shipmentAddressCompany | String |
| shipmentAddressFirstName | String |
| shipmentAddressLastName | String |
| shipmentAddressStreet | String |
| shipmentAddressPostalCode | String |
| shipmentAddressCity | String |
| shipmentAddressCountryName | String |
| shipmentAddressPhoneNumber | String |
| shipmentAddressFax | String |
| shipmentAddressEmailAddress | String |
| shipmentAddressAdditionalCompanyLine | String |
| shipmentAddressAdditionalAddressLine | String |
| shipmentAddressState | String |
| createdByUserId | ID |
| status | String |
| salesChannelId | ID |
| companyId | ID |
| comment | String |
| ebayUsername | String |

## SalesInvoiceInternal

| Field | Type |
|-------|------|
| salesOrderId | ID |
| salesInvoiceId | ID |
| customerId | ID |
| platformId | ID |
| salesInvoicePaymentMethodId | ID |
| companyId | ID |
| paymentDueDateInDays | Int |
| paymentStatus | Byte |
| salesInvoiceNumber | String |
| salesInvoiceDate | DateTime |
| externalOrderNumber | String |
| shipmentType | Int |
| valueDate | DateTime |
| taxSetting | Int |
| customerVatIdNumber | String |
| salesInvoiceVatIdNumber | String |
| departureCountryIso | String |
| paymentMethodId | ID |
| serviceDate | DateTime |
| salesInvoiceCustomerNumber | String |
| accountsReceivableNumber | Int |
| currencyIso | String |
| currencyFactor | Decimal |
| departureCountryCurrencyIso | String |
| departureCountryCurrencyFactor | Decimal |
| totalGrossAmount | Decimal |
| totalNetAmount | Decimal |
| lastShippingDate | DateTime |
| salesOrderNumber | String |
| createdInErpDate | DateTime |
| platformID | String |
| paymentMethod | String |
| paymentMethodName | String |
| shipmentAddressCompany | String |
| shipmentAddressSalutation | String |
| shipmentAddressTitle | String |
| shipmentAddressFirstName | String |
| shipmentAddressLastName | String |
| shipmentAddressStreet | String |
| shipmentAddressPostalCode | String |
| shipmentAddressCity | String |
| shipmentAddressCountry | String |
| shipmentAddressPhoneNumber | String |
| shipmentAddressFaxNumber | String |
| shipmentAddressAdditionalAddressLine | String |
| shipmentAddressCountryIso | String |
| shipmentAddressVatIdNumber | String |
| salesOrderShipmentCountryIso | String |
| billingAddressCompany | String |
| billingAddressSalutation | String |
| billingAddressTitle | String |
| billingAddressFirstName | String |
| billingAddressLastName | String |
| billingAddressStreet | String |
| billingAddressPostalCode | String |
| billingAddressCity | String |
| billingAddressCountry | String |
| billingAddressPhoneNumber | String |
| billingAddressFaxNumber | String |
| billingAddressAdditionalAddressLine | String |
| billingAddressCountryIso | String |
| customerDefaultBillingAddressCompany | String |
| customerDefaultBillingAddressSalutation | String |
| customerDefaultBillingAddressTitle | String |
| customerDefaultBillingAddressFirstName | String |
| customerDefaultBillingAddressLastName | String |
| customerDefaultBillingAddressStreet | String |
| customerDefaultBillingAddressPostalCode | String |
| customerDefaultBillingAddressCity | String |
| customerDefaultBillingAddressCountry | String |
| customerDefaultBillingAddressPhoneNumber | String |
| customerDefaultBillingAddressFaxNumber | String |
| customerDefaultBillingAddressCountryIso | String |
| customerDefaultBillingAddressEmailAddress | String |
| customerDefaultBillingAddressVatIdNumber | String |
| customerNumber | String |
| customerGroupId | ID |
| customerPaymentDueDateInDays | Int |
| deposit | String |
| cancelledSalesInvoiceId | ID |
| dropShippingDeliveryNoteCount | Int |

## SalesInvoiceLineItemInternal

| Field | Type |
|-------|------|
| salesInvoiceId | ID |
| salesInvoicePositionId | ID |
| salesOrderId | ID |
| itemId | ID |
| billOfMaterialsSalesInvoiceLineItemId | ID |
| salesInvoiceLineItemId | ID |
| salesPriceGross | Decimal |
| salesPriceNet | Decimal |
| purchasePriceNet | Decimal |
| itemPurchasePriceNet | Decimal |
| quantity | Decimal |
| name | String |
| sku | String |
| taxRate | Decimal |
| taxClassId | ID |
| invoiceLineItemType | Byte |
| parentItemId | ID |
| taric | String |
| itemWeight | Decimal |
| itemVolume | Decimal |
| productGroupId | ID |
| productGroupName | String |
| warehouseId | ID |

## SalesInvoiceListItem

| Field | Type |
|-------|------|
| salesInvoiceId | ID |
| createdByUserId | ID |
| customerId | ID |
| currencyIso | String |
| companyId | ID |
| companyName | String |
| vatIdNumber | String |
| paymentMethodId | ID |
| paymentMethodName | String |
| isDunningBlocked | Boolean |
| salesInvoiceDate | DateTime |
| valueDate | DateTime |
| salesInvoiceNumber | String |
| currencyFactor | Decimal |
| shippingMethodId | ID |
| shippingMethodName | String |
| isDraft | Boolean |
| salesChannelId | ID |
| platformId | ID |
| languageId | ID |
| taxSetting | SalesInvoiceTaxSetting |
| isIntraCommunityDelivery | Boolean |
| isExemptFromVat | Boolean |
| ebayUsername | String |
| salesChannelName | String |
| isExternalSalesInvoice | Boolean |
| printExistingSalesInvoice | Boolean |
| paymentDate | DateTime |
| printDate | DateTime |
| mailDate | DateTime |
| isDunned | Boolean |
| stillToPay | Decimal |
| alreadyPaidAmount | Decimal |
| isCompletelyPaid | Boolean |
| comment | String |
| customerComment | String |
| salesInvoiceCorrectionTotalGrossAmount | Decimal |
| hasSalesInvoiceCorrection | Boolean |
| paymentStatus | InvoicePaymentStatus |
| shipmentAddressCompanyName | String |
| shipmentAddressSalutation | String |
| shipmentAddressTitle | String |
| shipmentAddressFirstName | String |
| shipmentAddressLastName | String |
| shipmentAddressStreet | String |
| shipmentAddressAdditionalAddressLine | String |
| shipmentAddressPostalCode | String |
| shipmentAddressCity | String |
| shipmentAddressCountryName | String |
| shipmentAddressPhoneNumber | String |
| shipmentAddressMobilePhoneNumber | String |
| shipmentAddressFaxNumber | String |
| shipmentAddressEmailAddress | String |
| shipmentAddressAdditionalCompanyLine | String |
| shipmentAddressPostId | String |
| shipmentAddressState | String |
| shipmentAddressCountryIso | String |
| billingAddressCompanyName | String |
| billingAddressSalutation | String |
| billingAddressTitle | String |
| billingAddressFirstName | String |
| billingAddressLastName | String |
| billingAddressStreet | String |
| billingAddressAdditionalAddressLine | String |
| billingAddressPostalCode | String |
| billingAddressCity | String |
| billingAddressCountryName | String |
| billingAddressPhoneNumber | String |
| billingAddressMobilePhoneNumber | String |
| billingAddressFaxNumber | String |
| billingAddressEmailAddress | String |
| billingAddressAdditionalCompanyLine | String |
| billingAddressPostId | String |
| billingAddressState | String |
| billingAddressCountryIso | String |
| totalGrossAmount | Decimal |
| shippingCountryTotalGrossAmount | Decimal |
| totalNetAmount | Decimal |
| shippingCountryTotalNetAmount | Decimal |
| createdByUserName | String |
| customerNumber | String |
| accountsReceivableNumber | Int |
| customerGroupName | String |
| paymentDueDateInDays | Int |
| paymentDueDate | DateTime |
| dunningLevel | Int |
| dunningDate | DateTime |
| isArchived | Boolean |
| processColourCode | Int |
| processColourName | String |
| platformType | Int |
| salesOrderNumber | String |
| isCorrected | Boolean |
| isCancelled | Boolean |
| cancelledDate | DateTime |
| cancellationComment | String |
| cancellationUserName | String |
| cancellationReason | String |
| salesOrderId | ID |
| externalSalesOrderNumber | String |
| serviceDateFrom | DateTime |
| serviceDateTo | DateTime |
| lastShippingDate | DateTime |

## SalesOrder

| Field | Type |
|-------|------|
| id | ID |
| customerId | ID |
| paymentInfo | SalesOrderPaymentInfo |
| text | SalesOrderText |
| salesOrderDate | DateTime |
| isCancelled | Boolean |
| isPending | Boolean |
| itemDescriptionType | ItemDescriptionType |
| readOnlyType | ReadOnlyType |
| salesOrderStatus | ProcessStatus |
| salesOrderNumber | String |
| departureCountry | SalesOrderDepartureCountry |
| externalDetails | SalesOrderExternalDetails |
| paymentDetails | SalesOrderPaymentDetails |
| shippingDetails | SalesOrderShippingDetails |
| taxDetails | SalesOrderTaxDetails |
| processColourId | ID |
| onHoldReasonId | ID |
| cartonItemId | ID |
| paymentMethodId | ID |
| shippingMethodId | ID |
| processStatusId | ID |
| languageIso | String |
| customerSalesOrderNumber | String |
| vatId | String |
| companyId | ID |
| shipmentAddress | SalesOrderAddress |
| billingAddress | SalesOrderAddress |
| otherAddress | SalesOrderAddress |
| lineItems | Object |

## SalesOrderAddress

| Field | Type |
|-------|------|
| salesOrderId | ID |
| type | AddressType |
| customerId | ID |
| salutation | String |
| title | String |
| firstName | String |
| lastName | String |
| company | String |
| additionalCompanyLine | String |
| street | String |
| additionalAddressLine | String |
| city | String |
| postalCode | String |
| state | String |
| countryIso | String |
| postId | String |
| emailAddress | String |
| phoneNumber | String |
| mobilePhoneNumber | String |
| fax | String |
| country | String |
| customsDocumentsRequired | Boolean |
| vatId | String |

## SalesOrderDepartureCountry

| Field | Type |
|-------|------|
| countryIso | String |
| currencyIso | String |
| currencyFactor | Decimal |
| state | String |

## SalesOrderExternalDetails

| Field | Type |
|-------|------|
| externalCreatedDate | DateTime |
| externalInvoiceType | ExternalSalesInvoiceType |
| externalSalesOrderNumber | String |

## SalesOrderLineItem

| Field | Type |
|-------|------|
| id | ID |
| salesOrderId | ID |
| itemId | ID |
| sku | String |
| isReserved | Boolean |
| name | String |
| fnSku | String |
| type | LineItemType |
| quantity | Decimal |
| salesUnit | String |
| salesPriceNet | Decimal |
| discountPercent | Decimal |
| purchasePriceNet | Decimal |
| taxRate | Decimal |
| taxClassId | ID |
| taxCodeId | ID |
| note | String |
| totalSalesPriceNet | Decimal |
| totalSalesPriceGross | Decimal |
| sortOrder | Int |
| configurationItemType | ConfigurationItemType |
| billOfMaterialsType | BillOfMaterialsType |
| standardName | String |
| hasUpload | Boolean |

## SalesOrderListItem

| Field | Type |
|-------|------|
| id | ID |
| accountsReceivableNumber | Int |
| assignedUserId | ID |
| companyName | String |
| createdByUserId | ID |
| currencyFactor | Decimal |
| currencyIso | String |
| customerId | ID |
| customerNumber | String |
| deliveryCompleteStatus | DeliveryCompleteStatus |
| departureCountryIso | String |
| departureCountryCurrencyFactor | Decimal |
| departureCountryCurrencyIso | String |
| ebayUsername | String |
| estimatedDeliveryDate | DateTime |
| externalSalesInvoiceType | ExternalSalesInvoiceType |
| externalSalesOrderNumber | String |
| extraWeight | Decimal |
| isIntraCommunityDelivery | Boolean |
| isCancelled | Boolean |
| isPending | Boolean |
| itemDescriptionType | ItemDescriptionType |
| languageIso | String |
| lastShippingDate | DateTime |
| needsOnlineSynchronisation | Boolean |
| onHoldReasonId | ID |
| paymentMethodId | ID |
| paymentDueDateInDays | Int |
| platformId | ID |
| processColourCode | Int |
| processColourName | String |
| processStatusName | String |
| readOnlyType | ReadOnlyType |
| salesChannelId | ID |
| salesOrderDate | DateTime |
| salesOrderNumber | String |
| salesOrderStatus | Byte |
| shippingMethodId | ID |
| shippingPriority | Int |
| shopPaymentModule | String |
| taxSetting | TaxSetting |
| totalGrossAmount | Decimal |
| isExemptFromVat | Boolean |
| companyId | ID |
| onlineSalesOrderId | Int |
| comment | String |
| printDate | DateTime |
| mailDate | DateTime |
| paymentMailDate | DateTime |
| dateOfPayment | DateTime |
| paymentDate | DateTime |
| onHoldReasonName | String |
| salesInvoiceStatus | InvoiceStatus |
| billingAddressCompany | String |
| billingAddressAdditionalCompanyLine | String |
| billingAddressSalutation | String |
| billingAddressTitle | String |
| billingAddressFirstName | String |
| billingAddressLastName | String |
| billingAddressStreet | String |
| billingAddressAdditionalAddressLine | String |
| billingAddressPostalCode | String |
| billingAddressCity | String |
| billingAddressCountryName | String |
| billingAddressPhoneNumber | String |
| billingAddressMobilePhoneNumber | String |
| billingAddressFax | String |
| billingAddressEmailAddress | String |
| billingAddressPostId | String |
| billingAddressState | String |
| billingAddressCountryIso | String |
| shipmentAddressCompany | String |
| shipmentAddressAdditionalCompanyLine | String |
| shipmentAddressSalutation | String |
| shipmentAddressTitle | String |
| shipmentAddressFirstName | String |
| shipmentAddressLastName | String |
| shipmentAddressStreet | String |
| shipmentAddressAdditionalAddressLine | String |
| shipmentAddressPostalCode | String |
| shipmentAddressCity | String |
| shipmentAddressCountryName | String |
| shipmentAddressPhoneNumber | String |
| shipmentAddressMobilePhoneNumber | String |
| shipmentAddressFax | String |
| shipmentAddressEmailAddress | String |
| shipmentAddressPostId | String |
| shipmentAddressState | String |
| shipmentAddressCountryIso | String |
| assignedUserName | String |
| salesChannelName | String |
| customerGroupName | String |
| paymentMethodName | String |
| shippingMethodName | String |
| shippingCountryTotalGrossAmount | Decimal |
| customerComment | String |
| paymentReference | String |
| salesInvoiceCorrectionTotalGrossAmount | Decimal |
| alreadyPaidAmount | Decimal |
| stillToPay | Decimal |
| totalNetAmount | Decimal |
| wmsLocked | Byte |
| wmsPartialShipment | Int |
| wmsPrePicking | Int |
| paymentStatus | InvoicePaymentStatus |
| deliveryStatus | DeliveryStatus |
| platformType | Int |
| salesInvoiceNumbers | String |
| cancelledDate | DateTime |
| cancellationComment | String |
| cancellationUserName | String |
| cancellationReason | String |
| amazonUserId | Int |
| createdByUserName | String |
| salesInvoices | SalesInvoiceListItem |

## SalesOrderPaymentDetails

| Field | Type |
|-------|------|
| cashDiscount | Decimal |
| cashDiscountDays | Int |
| financingCosts | Decimal |
| paymentDueDateInDays | Int |
| currencyIso | String |
| currencyFactor | Decimal |

## SalesOrderPaymentInfo

| Field | Type |
|-------|------|
| accountHolder | String |
| bankName | String |
| bic | String |
| creditorId | String |
| dueDate | DateTime |
| endToEndId | String |
| iban | String |
| mandateReference | String |
| paymentInfo | String |
| paymentInfoType | Byte |
| paymentReference | String |
| referenceEmail | String |

## SalesOrderShippingDetails

| Field | Type |
|-------|------|
| deliveryFromDate | DateTime |
| estimatedDeliveryDate | DateTime |
| extraWeight | Decimal |
| maxDeliveryDays | Int |
| shippingDate | DateTime |
| shippingPriority | Int |

## SalesOrderTaxDetails

| Field | Type |
|-------|------|
| taxReference | TaxReference |
| specialTaxTreatment | SpecialTaxTreatment |
| taxSetting | TaxSetting |

## SalesOrderText

| Field | Type |
|-------|------|
| comment | String |
| customerComment | String |
| printText | String |
| processStatus | String |

## SalesQuotation

| Field | Type |
|-------|------|
| id | ID |
| customerId | ID |
| paymentInfo | SalesQuotationPaymentInfo |
| text | SalesQuotationText |
| salesQuotationDate | DateTime |
| isCancelled | Boolean |
| isPending | Boolean |
| itemDescriptionType | ItemDescriptionType |
| readOnlyType | ReadOnlyType |
| salesQuotationStatus | ProcessStatus |
| salesQuotationNumber | String |
| departureCountry | SalesQuotationDepartureCountry |
| externalDetails | SalesQuotationExternalDetails |
| paymentDetails | SalesQuotationPaymentDetails |
| shippingDetails | SalesQuotationShippingDetails |
| taxDetails | SalesQuotationTaxDetails |
| processColourId | ID |
| onHoldReasonId | ID |
| cartonItemId | ID |
| paymentMethodId | ID |
| shippingMethodId | ID |
| processStatusId | ID |
| languageIso | String |
| customerSalesQuotationNumber | String |
| vatId | String |
| companyId | ID |
| shipmentAddress | SalesQuotationAddress |
| billingAddress | SalesQuotationAddress |
| otherAddress | SalesQuotationAddress |
| lineItems | Object |

## SalesQuotationAddress

| Field | Type |
|-------|------|
| salesQuotationId | ID |
| type | AddressType |
| customerId | ID |
| salutation | String |
| title | String |
| firstName | String |
| lastName | String |
| company | String |
| additionalCompanyLine | String |
| street | String |
| additionalAddressLine | String |
| city | String |
| postalCode | String |
| state | String |
| countryIso | String |
| postId | String |
| emailAddress | String |
| phoneNumber | String |
| mobilePhoneNumber | String |
| fax | String |
| country | String |
| customsDocumentsRequired | Boolean |

## SalesQuotationDepartureCountry

| Field | Type |
|-------|------|
| countryIso | String |
| currencyIso | String |
| currencyFactor | Decimal |
| stateCode | String |

## SalesQuotationExternalDetails

| Field | Type |
|-------|------|
| externalCreatedDate | DateTime |
| externalInvoiceType | ExternalSalesInvoiceType |
| externalSalesQuotationNumber | String |

## SalesQuotationLineItem

| Field | Type |
|-------|------|
| id | ID |
| salesQuotationId | ID |
| itemId | ID |
| sku | String |
| isReserved | Boolean |
| name | String |
| fnSku | String |
| type | LineItemType |
| quantity | Decimal |
| salesUnit | String |
| salesPriceNet | Decimal |
| discountPercent | Decimal |
| purchasePriceNet | Decimal |
| taxRate | Decimal |
| taxClassId | ID |
| taxCodeId | ID |
| note | String |
| totalSalesPriceNet | Decimal |
| totalSalesPriceGross | Decimal |
| sortOrder | Int |
| configurationItemType | ConfigurationItemType |
| billOfMaterialsType | BillOfMaterialsType |
| standardName | String |
| hasUpload | Boolean |

## SalesQuotationListItem

| Field | Type |
|-------|------|
| id | ID |
| assignedUserId | ID |
| customerId | ID |
| shippingMethodId | ID |
| companyId | ID |
| paymentMethodId | ID |
| salesQuotationNumber | String |
| externalSalesQuotationNumber | String |
| platformName | String |
| comment | String |
| currencyIso | String |
| currencyFactor | Decimal |
| printDate | DateTime |
| mailDate | DateTime |
| processStatusName | String |
| extraWeight | Decimal |
| shippingWeight | Decimal |
| salesQuotationDate | DateTime |
| departureCountryIso | String |
| departureCountryName | String |
| departureCountryCurrencyIso | String |
| departureCountryCurrencyFactor | Decimal |
| billingAddressCompany | String |
| billingAddressFirstName | String |
| billingAddressLastName | String |
| billingAddressStreet | String |
| billingAddressAdditionalAddressLine | String |
| billingAddressPostalCode | String |
| billingAddressCity | String |
| billingAddressCountryName | String |
| billingAddressPhoneNumber | String |
| billingAddressFax | String |
| billingAddressEmailAddress | String |
| billingAddressAdditionalCompanyLine | String |
| billingAddressState | String |
| shipmentAddressCompany | String |
| shipmentAddressFirstName | String |
| shipmentAddressLastName | String |
| shipmentAddressStreet | String |
| shipmentAddressAdditionalAddressLine | String |
| shipmentAddressPostalCode | String |
| shipmentAddressCity | String |
| shipmentAddressCountryName | String |
| shipmentAddressPhoneNumber | String |
| shipmentAddressFax | String |
| shipmentAddressEmailAddress | String |
| shipmentAddressAdditionalCompanyLine | String |
| shipmentAddressState | String |
| assignedUserName | String |
| createdByUserName | String |
| companyName | String |
| salesChannelName | String |
| customerGroupName | String |
| paymentMethodName | String |
| shippingMethodName | String |
| customerNumber | String |
| totalGrossAmount | Decimal |
| totalNetAmount | Decimal |
| shippingCountryTotalGrossAmount | Decimal |
| shippingCountryTotalNetAmount | Decimal |
| customerComment | String |
| processColourCode | Int |
| processColourName | String |

## SalesQuotationPaymentDetails

| Field | Type |
|-------|------|
| cashDiscount | Decimal |
| cashDiscountDays | Int |
| financingCosts | Decimal |
| paymentDueDateInDays | Int |
| currencyIso | String |
| currencyFactor | Decimal |

## SalesQuotationPaymentInfo

| Field | Type |
|-------|------|
| accountHolder | String |
| bankName | String |
| bic | String |
| creditorId | String |
| dueDate | DateTime |
| endToEndId | String |
| iban | String |
| mandateReference | String |
| paymentInfo | String |
| paymentInfoType | Byte |
| paymentReference | String |
| referenceEmail | String |

## SalesQuotationShippingDetails

| Field | Type |
|-------|------|
| deliveryFromDate | DateTime |
| estimatedDeliveryDate | DateTime |
| extraWeight | Decimal |
| maxDeliveryDays | Int |
| shippingDate | DateTime |
| shippingPriority | Int |

## SalesQuotationTaxDetails

| Field | Type |
|-------|------|
| specialTaxTreatment | SpecialTaxTreatment |
| taxSetting | TaxSetting |

## SalesQuotationText

| Field | Type |
|-------|------|
| comment | String |
| customerComment | String |
| printText | String |
| processStatus | String |

## SaleschannelImages

| Field | Type |
|-------|------|
| saleschannelId | ID |
| images | Object |

## SerialNumberListItem

| Field | Type |
|-------|------|
| warehouseId | ID |
| storageLocationId | ID |
| itemId | ID |
| serialNumber | String |
| isActive | Boolean |

## ShippingAddress

| Field | Type |
|-------|------|
| company | String |
| salutation | String |
| title | String |
| firstName | String |
| lastName | String |
| street | String |
| zipCode | String |
| city | String |
| country | String |
| phone | String |
| addressSupplement | String |
| addressSupplement2 | String |
| postId | String |
| mobile | String |
| mail | String |
| fax | String |
| state | String |
| iso | String |
| customsDocumentsRequired | Boolean |

## ShippingBoxListItem

| Field | Type |
|-------|------|
| id | ID |
| displayId | String |
| typeId | ID |
| binLocationId | ID |
| warehouseId | ID |
| locked | Boolean |

## ShippingBoxType

| Field | Type |
|-------|------|
| value | ID |
| name | String |

## ShippingClassListItem

| Field | Type |
|-------|------|
| id | ID |
| name | String |

## ShippingMethodLookupItem

| Field | Type |
|-------|------|
| id | ID |
| name | String |
| isActive | Boolean |

## StockMovementHistoryItem

| Field | Type |
|-------|------|
| articleNumber | String |
| articleName | String |
| quantity | Decimal |
| bestBeforeDate | DateTime |
| batchNumber | String |
| serialNumber | String |
| serialNumberCount | Int |
| sourceBinLocation | String |
| targetBinLocation | String |
| sourceBoxDisplayId | String |
| targetBoxDisplayId | String |
| transferTypeId | Int |
| transferTypeName | String |
| userName | String |
| timestamp | DateTime |
| comment | String |

## StockReservationListItem

| Field | Type |
|-------|------|
| itemId | ID |
| salesOrderId | ID |
| customerId | ID |
| amount | Decimal |
| createdAt | DateTime |
| ebayItemId | String |
| platform | String |

## StorageLocationListItem

| Field | Type |
|-------|------|
| id | ID |
| name | String |

## Supplier

| Field | Type |
|-------|------|
| id | ID |
| name | String |
| canDropship | Boolean |
| currencyIso | String |

## SupplierPrice

| Field | Type |
|-------|------|
| fromQuantity | Decimal |
| netPrice | Decimal |
| usePercentageDiscount | Boolean |
| percentageDiscount | Decimal |

## TaxClass

| Field | Type |
|-------|------|
| id | ID |
| isStandard | Boolean |
| name | String |
| taxType | TaxType |

## TaxClassWithTaxRate

| Field | Type |
|-------|------|
| id | ID |
| name | String |
| isStandard | Boolean |
| rate | Decimal |

## TaxCode

| Field | Type |
|-------|------|
| id | ID |
| cashDiscountAccount | String |
| generalLedgerAccount | String |
| isAutomatic | Boolean |
| name | String |
| number | Int |

## UpdateCategoryCommandResponse

| Field | Type |
|-------|------|
| categoryId | ID |

## UpdateCustomerCommandResponse

| Field | Type |
|-------|------|
| customerId | ID |

## UpdateSalesOrderCommandResponse

| Field | Type |
|-------|------|
| salesOrderId | ID |

## Variation

| Field | Type |
|-------|------|
| variationId | ID |
| position | Int |
| descriptions | Object |
| values | Object |
| variationType | VariationType |

## VariationValue

| Field | Type |
|-------|------|
| variationValueId | ID |
| itemNumber | String |
| gtin | String |
| weightOffset | Decimal |
| descriptions | Object |
| surcharges | VariationValueSurcharges |
| position | Int |
| image | ID |

## VariationValueSurcharges

| Field | Type |
|-------|------|
| defaultSurchargeNet | Decimal |
| customerGroupSurcharges | Object |
| salesChannelSurcharges | Object |

## WarehouseAddress

| Field | Type |
|-------|------|
| id | ID |
| name | String |
| shortcut | String |
| description | String |
| street | String |
| zipCode | String |
| city | String |
| country | String |
| phone | String |
| mail | String |
| addressSupplement | String |

## WarehouseListItem

| Field | Type |
|-------|------|
| id | ID |
| name | String |
| active | Boolean |

## WarehouseZoneListItem

| Field | Type |
|-------|------|
| zoneId | ID |
| code | String |
| description | String |
| warehouseId | ID |
| zoneType | Int |

## WorkbenchResource

| Field | Type |
|-------|------|
| id | ID |
| number | String |
| name | String |
| description | String |
| workbenchResourceTypeId | ID |
| hostName | String |
| warehouseId | ID |
| reservationMode | ReservationMode |
| autoShowProcessParameterValuesInProduction | Boolean |
| expiredComponentsUsage | ExpiredComponentsUsage |
| replenishmentCreationStockReservationMode | ReplenishmentCreationAvailableStockReservationMode |

## WorkbenchResourceType

| Field | Type |
|-------|------|
| id | ID |
| name | String |

## ZoneBinLocationItem

| Field | Type |
|-------|------|
| zoneId | ID |
| binLocationId | ID |

## ZoneType

| Field | Type |
|-------|------|
| value | Int |
| name | String |

