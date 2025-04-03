import { View, Text, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import appStyles, { fonts } from '../../../../Assets/native/appStyles';
import { productStyles } from '../productstyle';
import { colors } from '../../../../Assets/native/colors';
import { API_BASE_URL } from '../../../../Helpers/constant';
import CustomButton from '../../../../Widgets/native/customButton';
import ImagerSideBar from '../ImageSidebar';
import useImagePicker from '../../../../Hooks/useImagePicker';
import useMutationData from '../../../../Hooks/useCommonMutate';
import { setOperationType, setProudctData } from '../../../../redux/slices/productSlice';
import { getBucketUrl } from '../../../ProductDetails/action';
import { buildDataObject, checkRequiredFields, imagesArray, uploadOnWasabi } from '../../../../Widgets/native/commonNativeFunctions';
import { getDimensions, productNavigationKeys } from '../../../../Helpers/native/constants';
import { showToaster } from '../../../../Widgets/native/commonFunction';
import useSelectableData from '../../../../Hooks/selectUnselectValues/useSelectableData';
import { AddImage, AddImageBlackIcon, CrossIcon } from '../../../../Assets/native/images';
import AddProductButton from '../AddProductButton';
import ImagePicker from 'react-native-image-crop-picker';


const ProductImages = ({ formikInstace, dataReset, setLoader, loader }) => {
      const { height } = getDimensions();
      const dispatch = useDispatch();
      const [boxes, setBoxes] = useState([{ id: 1 }]);

      const { operationType, updateProductData } = useSelector(state => state?.productSlice || {});
      const navigation = useNavigation();
      const { values, resetForm, handleSubmit: formikSubmit, setFieldValue, errors } = formikInstace || {};
      const { bundle_price, client_id, product_category, ...rest } = values || {};

      const productImagePicker = useImagePicker();
      const moreInfoImagePicker = useImagePicker();
      const thumbnailImagePicker = useImagePicker();
      const moreInfoThumbnailPicker = useImagePicker();

      const imageUrl = (field, image) => updateProductData?.[field] && !image ? `${API_BASE_URL}s3/media/image/${updateProductData?.[field]}` : image?.path;
      const firstImage = imageUrl('product_image', productImagePicker?.image);
      const secondImage = imageUrl('product_more_info_image', moreInfoImagePicker?.image);
      const thirdImage = imageUrl('product_image_thumbnail', thumbnailImagePicker?.image);
      const fourthImage = imageUrl('product_more_info_image_thumbnail', moreInfoThumbnailPicker?.image);
      const moreImageArray = ["more_product_images_1", "more_product_images_2", "more_product_images_3"];



      const dataPayload = {
            ...rest,
            product_category,
            client_id: client_id?.id,
            product_image: productImagePicker?.image,
            product_more_info_image: moreInfoImagePicker.image,
            product_image_thumbnail: thumbnailImagePicker.image,
            product_more_info_image_thumbnail: moreInfoThumbnailPicker.image,
            more_product_images_1: boxes[0]?.url,
            more_product_images_2: boxes[1]?.url,
            more_product_images_3: boxes[2]?.url,
            others: { bundle_price }
      };

      const wasabiUrlMuation = useMutationData(getBucketUrl, async data => {
            if (!data.data) return;
            setLoader(true);
            const fileSourceArray = Object.keys(data?.data)?.map(element => {
                  if (dataPayload?.hasOwnProperty(element)) {
                        return {
                              fileSource: dataPayload[element],
                              wasabiUri: data.data[element].url,
                              fileName: data.data[element]?.filename,
                              keyName: element,
                        };
                  }
            });

            let fileNameArray = [];
            fileSourceArray?.forEach(element => {
                  if (dataPayload?.hasOwnProperty(element?.keyName)) {
                        const isKyesExist = moreImageArray?.includes(element?.keyName);
                        if (isKyesExist) {
                              if (fileNameArray?.length > 3) return
                              fileNameArray?.push(element?.fileName);
                              setFieldValue("more_product_images", fileNameArray);
                        } else setFieldValue(element?.keyName, element?.fileName);
                  }
            });
            const imageBuffer = await imagesArray(fileSourceArray);
            const finalArray = fileSourceArray?.map(element =>
                  imageBuffer?.map(bufferItems => ({
                        uri: element?.wasabiUri,
                        file: bufferItems,
                  }))
            );
            try {
                  const promises = finalArray[0]?.map(item => uploadOnWasabi(item));
                  const results = await Promise?.all(promises);
                  const hasSuccess = results.every(item => item?.success);
                  if (hasSuccess) {
                        if (operationType === 'EDIT' && updateProductData) {
                              pressCancel();
                              formikSubmit();
                        } else formikSubmit();

                  }
                  return results;
            } catch (error) {
                  setLoader(false);
                  pressCancel();
                  console.error('Error processing all Wasabi URLs:', error);
                  showToaster("error", "Something went wrong...")
                  dataReset();
                  navigation.navigate(productNavigationKeys?.productdetails);
                  throw error;
            }
      });

      const handleSubmit = () => {
            if (Object.keys(errors)?.length > 0) return;
            if (operationType === 'EDIT' && updateProductData && !productImagePicker?.image && !moreInfoImagePicker?.image && !thumbnailImagePicker?.image && !moreInfoThumbnailPicker?.image) {
                  setFieldValue('product_image', firstImage);
                  setFieldValue('product_more_info_image', secondImage);
                  setFieldValue('product_image_thumbnail', thirdImage);
                  setFieldValue('product_more_info_image_thumbnail', fourthImage);
                  setFieldValue('client_id', updateProductData?.client_id);
                  formikSubmit();
                  return;
            } else {
                  const { selectedImagesKeys } = buildDataObject(firstImage, secondImage, thirdImage, boxes);
                  if (!firstImage || !secondImage) {
                        alert('First two images are required');
                        return;
                  } else {
                        const { success, missingField } = checkRequiredFields({ ...values, product_image: firstImage });
                        if (!success) {
                              alert(missingField);
                              setLoader(false);
                              return
                        }
                        wasabiUrlMuation.mutate({
                              type: 'image',
                              data: {
                                    ...selectedImagesKeys,
                              },
                        });
                  }
            }
      };

      const pressCancel = () => {
            productImagePicker.setImage(null);
            moreInfoImagePicker.setImage(null);
            thumbnailImagePicker.setImage(null);
            moreInfoThumbnailPicker.setImage(null);
            dataReset()
      };


      const openGallery = async (id) => {
            try {
                  const fileObject = await ImagePicker.openPicker({
                        width: 300,
                        height: 400,
                        cropping: true,
                  });
                  setBoxes(prevBoxes => prevBoxes?.map(box => box?.id === id ? { id: id, url: fileObject } : { ...box }));
                  addBox();
            } catch (error) {
                  console.error('Error opening gallery:', error);
            }
      };

      const addBox = () => boxes?.length < 3 && setBoxes((prev) => [...prev, { id: boxes?.length + 1 }]);
      const deleteBox = id => id === 1 ? setBoxes([{ id: 1, uri: "" }]) : setBoxes(boxes?.filter(box => box?.id !== id));

      const renderItem = ({ item }) => (
            <View style={[{ gap: 3 }]}>
                  <TouchableOpacity onPress={() => deleteBox(item?.id)} style={{ alignSelf: "flex-end", }}>
                        <CrossIcon height={20} width={20} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openGallery(item?.id)}>
                        <ImagerSideBar url={item?.url?.path} icon={<AddImageBlackIcon height={70} width={70} text={true} />} />
                  </TouchableOpacity>
            </View>
      );

      return (

            <View style={{ backgroundColor: colors.appBackground, flex: 1 }}>
                  <View style={[productStyles.container, productStyles.gap_5,]}>
                        <View style={[productStyles.gap_5, { paddingTop: 20, }]}>
                              <View style={[appStyles.rowSpaceBetweenAlignCenter, { justifyContent: "flex-start" }]}>
                                    <ImageHandler uri={firstImage} text="Product Image" onSelect={productImagePicker.openGallery} index={1} />
                                    <ImageHandler uri={secondImage} text=" More Info Images" onSelect={moreInfoImagePicker.openGallery} index={2} />
                                    <ImageHandler uri={thirdImage} text="Promo Image" onSelect={thumbnailImagePicker.openGallery} index={3} />
                              </View>
                        </View>
                  </View>
                  <Text style={[appStyles.subHeaderText, fonts.bold, { marginTop: 5 }]}>More Images</Text>
                  <View style={[productStyles.container, productStyles.gap_5, { marginTop: 10 }]}>
                        <View style={[productStyles.gap_5]}>
                              <FlatList
                                    data={boxes}
                                    contentContainerStyle={{ gap: 30, flex: 1, paddingHorizontal: 15 }}
                                    renderItem={renderItem}
                                    keyExtractor={item => item?.id?.toString()}
                                    horizontal={true}
                                    ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                              />
                        </View>
                  </View>

                  <View style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 10, position: "absolute", bottom: 20 }]}>
                        <View style={{ flex: 0.5 }}>
                              <CustomButton
                                    text="Cancel"
                                    onPress={pressCancel}
                                    style={[!loader ? appStyles.touchableButtonCyan : appStyles.touchableButtonGreyDisabled, { backgroundColor: 'white' }]}
                                    disabled={loader}
                                    textClr={colors.appLightGrey}
                              />
                        </View>
                        <View style={{ flex: 0.5 }}>
                              <CustomButton
                                    text={operationType !== "ADD" && updateProductData ? 'Updates' : "Save"}
                                    onPress={handleSubmit}
                                    style={[!loader ? appStyles.touchableButtonCyan : appStyles.touchableButtonGreyDisabled]}
                                    disabled={wasabiUrlMuation.isPending || loader}
                                    isPending={wasabiUrlMuation.isPending || loader}
                              />
                        </View>
                  </View>
            </View>
      );
};

export default ProductImages;


const ImageHandler = ({ uri, text, onSelect ,index}) => (
      <TouchableOpacity style={{ marginLeft: 15 }} onPress={onSelect}>
            <ImagerSideBar url={uri} text={text}  index={index}/>
      </TouchableOpacity>
);
