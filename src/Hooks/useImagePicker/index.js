import { useState } from 'react';
import { Platform, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const useImagePicker = () => {
    const [image, setImage] = useState(null);

    const requestCameraPermission = async () => {
        const permission =
            Platform.OS === 'android'
                ? PERMISSIONS.ANDROID.CAMERA
                : PERMISSIONS.IOS.CAMERA;

        const result = await request(permission);
        return result === RESULTS.GRANTED;
    };

    const requestGalleryPermission = async () => {
        const permission =
            Platform.OS === 'android'
                ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                : PERMISSIONS.IOS.PHOTO_LIBRARY;

        const result = await request(permission);
        return result === RESULTS.GRANTED;
    };

    const openGallery = async () => {
        try {
            const hasPermission = await requestGalleryPermission();
            // if (!hasPermission) {
            //     Alert.alert('Permission denied', 'We need access to your photo library to select photos');
            //     return;
            // }
            const result = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
            });
            setImage(result);
        } catch (error) {
            console.error('Error opening gallery:', error);
        }
    };

    const openCamera = async () => {
        try {
            const hasPermission = await requestCameraPermission();
            // if (!hasPermission) {
            //     Alert.alert('Permission denied', 'We need access to your camera to take photos');
            //     return;
            // }
            const result = await ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropping: true,
            });
            setImage(result);
        } catch (error) {
            console.error('Error opening camera:', error);
        }
    };

    return {
        openGallery,
        openCamera,
        image,
        setImage
    };
};

export default useImagePicker;
