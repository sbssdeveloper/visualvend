import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { getDimensions } from '../../../../Helpers/native/constants';
import ProductHeadings from '../../../../Widgets/native/ProductHeadings';
import NavigationHeader from '../../../../Widgets/native/navigationHeader';
import CurrentMachineHeader from '../../../../Widgets/native/currentMachineHeader';
import CustomButton from '../../../../Widgets/native/customButton';
import appStyles, { fonts } from '../../../../Assets/native/appStyles';
import { colors } from '../../../../Assets/native/colors';
import { productStyles } from '../../../Products/native/productstyle';
import Headings from '../../../Products/native/Headings';
import { DownloadIcon, RedStar } from '../../../../Assets/native/images';
import useDocumentPicker from '../../../../Hooks/doucmentPicker/useDocumentPicker';
import { exportPlanogram, uploadPlanogram } from '../../actions';
import ExportWrapper from '../../../Reports/native/ExportWrapper';
import { getToken, sortWordsLength } from '../../../../Helpers/native';
import { covertIntoBuffer, createAndDownloadExcelFile } from '../../../../Widgets/native/commonNativeFunctions';
import useFetchData from '../../../../Hooks/fetchCustomData/useFetchData';
import useMutationData from '../../../../Hooks/useCommonMutate';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import { getBucketUri, uploadFile } from '../../../ProductDetails/action';
import { showToaster } from '../../../../Widgets/native/commonFunction';

const UploadPlanogram = ({ navigation = {}, route: { params } = {} }) => {
  const { document, error, selectDocument } = useDocumentPicker();
  const { height = 100 } = getDimensions() || {};
  const devHeight = height * 1.2;

  const { data: planogramData } = useFetchData({ key: "GETPLANOGRAMEXPORTDATA", fn: exportPlanogram, page: 1, machine_id: params?.id, type: "planogram" });
  const { mutate } = useMutationData(uploadPlanogram)

  const successHandler = async (data) => {

    if (data.status === 200) {
      const { filename, url } = data?.data || {};
      try {
        const binaryData = covertIntoBuffer(document[0]?.uri);
        const payload = {
          uri: url,
          file: binaryData,
        };
        const success = await uploadFile(payload);
        success && showToaster("success", "Planogram upload successfully");
        // return { wasabiuri: item?.wasabiuri, success };
      } catch (error) {
        console.error('Error processing Wasabi URL:', error);
        throw error;
      }
    }
  }

  const { mutate: wasabiUrlMuation, isPending } = useMutationData(getBucketUri, successHandler, (error) => console.log(error, "======>Erorr"));
  const getUri = async (fileUri) => wasabiUrlMuation({ type: "file", extension: "xlsx" })


  return (
    <SafeAreaView>
      <NavigationHeader />
      <CurrentMachineHeader text={"Machines"} />
      <View style={[appStyles.mainContainer, { paddingHorizontal: undefined }]}>
        <View style={[appStyles.gap_10, appStyles.pv_10]}>
        </View>
        <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground }]}>
          <ProductHeadings heading={` ${params?.editMode ? "Edit Planogram" : "Upload Planogram"} `} style={appStyles.justifyCStart} />
          <View style={[appStyles.a_s_e]}>
            <ExportWrapper text={"Download Sample File"} Icon={DownloadIcon} handler={() => createAndDownloadExcelFile(planogramData?.data?.data)} />
          </View>
          <Text style={[appStyles.subHeaderText, fonts.bold, { color: colors.lightBlack, textAlign: "center" }]}>You should only upload .xls, .xlsx, .csv file formats.</Text>
          <ScrollView showsVerticalScrollIndicator={false} removeClippedSubviews={true} scrollEventThrottle={16}>
            <View style={{ height: devHeight }}>
              <View style={[productStyles.container, { marginTop: 10, height: 400 }]}>
                <View style={[appStyles.rowSpaceBetweenAlignCenter, { paddingLeft: 10, gap: 20 }]}>
                  <View style={{ flex: 1, gap: 10 }}>
                    {/* <Headings heading={"Planogram Name"} icon={<RedStar height={5} width={5} />} style={{ justifyContent: "flex-start", gap: 2 }} />
                    <CustTextInput
                      handleChange={handleChange('machine_name')}
                      textinputText={values?.machine_name}
                      handleBlur={handleBlur("machine_name")}
                      style={appStyles.customInputStyles}
                    /> */}
                    <Headings heading={"File"} icon={<RedStar height={5} width={5} />} style={{ justifyContent: "flex-start", gap: 2 }} />
                    <View style={[appStyles.customInputStyles, appStyles.rowSpaceBetweenAlignCenter, { borderRadius: 10, justifyContent: "flex-start", gap: 10 }]}>
                      <TouchableOpacity style={[appStyles.pv_10, appStyles.ph_10, { backgroundColor: "#F4F4F4", borderRadius: 5 }]} onPress={() => selectDocument()}>
                        <Text style={[appStyles.subHeaderText, { color: colors.lightBlack }]}>Choose File</Text>
                      </TouchableOpacity>
                      <Text style={[appStyles.subHeaderText, { color: colors.lightBlack }]}>{document && sortWordsLength(document[0]?.name, 30) || "No File Choosen"}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, marginTop: 50 }]}>



                <View style={{ flex: 0.5 }}>
                  <CustomButton
                    text={"Back"}
                    onPress={() => navigation.goBack()}
                    style={[appStyles.touchableButtonCyan, { backgroundColor: "white" }]}
                    disabled={isPending}
                    isPending={false}
                    textClr={colors.appLightGrey}
                  />
                </View>
                <View style={{ flex: 0.5 }}>
                  <CustomButton
                    text={"Upoad Planogram"}
                    onPress={() => getUri()}
                    style={[isPending ? appStyles.touchableButtonGreyDisabled : appStyles.touchableButtonCyan]}
                    disabled={isPending}
                    isPending={isPending}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default UploadPlanogram