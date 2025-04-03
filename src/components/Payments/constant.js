export const chartConfig = {
 backgroundColor: '#1cc910',
 backgroundGradientFrom: '#eff3ff',
 backgroundGradientTo: '#efefef',
 decimalPlaces: 2,
 color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
 style: {
   borderRadius: 16,
 },
}

export const paymethod = [
  { title: 'All Pay Methods', id: "1", method: "" },
  { title: 'Visa', id: "2", method: "VISA" },
  { title: 'Mastercard', id: "3", method: "MASTERCARD" },
  { title: 'Amex', id: "4", method: "AMEX" },
]


export const paymentStatusArray = [
  { title: 'All Payment Status', id: "1", value: "all" },
  { title: 'Successfull Payments', id: "2", value: "success" },
  { title: 'Failed Payments', id: "3", value: "error" },
]