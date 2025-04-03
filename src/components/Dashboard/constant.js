export const getProductData = (products) => ({
 headingFirst: "Product",
 secondHeading: products?.total,
 subHeadingOne: "Assigned",
 subHeadingtwo: "Unassigned",
 subHeadingOneValue: products?.assigned,
 subHeadingtwoValue: products?.unassigned,
});

export const getSaleData = (vend_sales) => ({
 headingFirst: "Vend Sales",
 secondHeading: vend_sales?.total,
 subHeadingOne: "Card",
 subHeadingtwo: "Mobile",
 subHeadingOneValue: vend_sales?.card_sales_count,
 subHeadingtwoValue: vend_sales?.mobile_payments_count,
});

export const getStockData = (stock_level) => ({
 headingFirst: "Stock Levels",
 secondHeading: stock_level?.required_quantity,
 subHeadingOne: "In Stock",
 subHeadingtwo: "Out of Stock",
 subHeadingOneValue: stock_level?.in_stock,
 subHeadingtwoValue: stock_level?.out_of_stock,
 total: parseInt(stock_level?.in_stock) + parseInt(stock_level?.out_of_stock),
});

export const getStaffData = (staff) => ({
 roundContainer: staff.total,
 subHeadingValue: staff.offline,
 percentage: (staff?.offline / staff?.total) * 100,
});

export const getMachineUsersData = (machine_users) => ({
 roundContainer: machine_users?.total,
 subHeadingValue: machine_users?.active,
 percentage: (machine_users?.active / machine_users?.total) * 100,
});


export const chartConfig = {
 backgroundGradientFrom: "white", // Match app background
 backgroundGradientTo: "white", // Match app background
 color: (opacity = 1) => `rgba(0, 0, 0, ${0.5})`, // Text and grid color: Dark grey
 strokeWidth: 0, // Line thickness
 barPercentage: 0,
 useShadowColorFromDataset: false,
 propsForLabels: {
  fill: "black", // Label text color
 },
 propsForDots: {
  r: "2", // Dot size
  strokeWidth: "1",
  stroke: "black", // Dot border color: Dark grey
 },
};