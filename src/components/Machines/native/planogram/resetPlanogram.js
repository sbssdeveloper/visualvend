import { View, Text, SafeAreaView, } from 'react-native'
import React from 'react'
import appStyles, { fonts } from '../../../../Assets/native/appStyles'
import Widget from '../../../../Widgets/native/widget'
import CustomSerach from '../../../../Widgets/native/customsearch'
import useModalStates from '../../../../Hooks/modalStates/useModalStates'
import { colors } from '../../../../Assets/native/colors'
import ProductHeadings from '../../../../Widgets/native/ProductHeadings'
import roundcontainerstyles from '../../../../Widgets/native/roundcontainer/roundcontainerstyles'
import { MachineLogo } from '../../../../Assets/native/images'
import CustomButton from '../../../../Widgets/native/customButton'
import useMutationData from '../../../../Hooks/useCommonMutate'
import { planogramReset } from '../../actions'
import NavigationHeader from '../../../../Widgets/native/navigationHeader'
import CurrentMachineHeader from '../../../../Widgets/native/currentMachineHeader'
import { showToaster } from '../../../../Widgets/native/commonFunction'

const ResetPlanogram = ({ navigation = {}, route: { params } = {} }) => {

  const resetSuccess = ({ data }) => {
    data?.success && showToaster("success", data?.message);
    navigation.goBack()
  }
  const resetError = ({ data }) => {
    const { machine_id } = data || {};
    showToaster("error",machine_id ? machine_id[0] : "Something Went Wrong")
  }
  const { mutate: resetMution, isPending } = useMutationData(planogramReset, (data) => resetSuccess(data), (data) => resetError(data));

  return (
    <SafeAreaView>
      <NavigationHeader />
      <CurrentMachineHeader text={"Machines"} />
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        <View style={[appStyles.gap_10, appStyles.pv_10]}>
        </View>
        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground }]}>
          <ProductHeadings heading={"Reset Planogram"} style={appStyles.justifyCStart} />
          <Text style={[appStyles.subHeaderText, fonts.regular, appStyles.pv_10, { color: colors.orange }]}>
            Warning: This will reset full Planogram of iqs01, products
            needs to be assigned again to machine {params?.machine_username}
          </Text>
          <View style={[roundcontainerstyles.roundBox, appStyles.rowCenter, appStyles.a_s_c, { height: "50%", width: "100%", flexDirection: "column" }]}>
            <MachineLogo height={100} width={100} />
            <Text style={[appStyles.headerText, { textAlign: "center" }]}>{params?.machine_username || ""}</Text>
          </View>

          <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, position: "relative", top: 50 }]}>
            <View style={{ flex: 0.5 }}>
              <CustomButton
                text={"Back"}
                onPress={() => navigation?.goBack()}
                style={[false ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan, { backgroundColor: colors.white }]}
                isPending={false}
                textClr={colors.appLightGrey}
              />
            </View>
            <View style={{ flex: 0.5 }}>
              <CustomButton
                text={"Reset"}
                onPress={() => resetMution({ machine_id: params?.id })}
                style={[isPending ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
                disabled={isPending}
                isPending={isPending}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )


}

export default ResetPlanogram