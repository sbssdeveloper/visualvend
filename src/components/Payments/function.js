import { ApplePayLogo, CardAccepted, CardDecline, GPay, PayPal } from "../../Assets/native/images"


export const getIcons = (iconType, item) => {

  switch (iconType) {
    case 'apple_pay':
      return <ApplePayLogo />
    case 'google_pay':
      return <GPay />
    case 'paypal':
      return <PayPal />
    case 'pay_to_card':
      return item?.error ? <CardDecline /> : <CardAccepted />

  }
}