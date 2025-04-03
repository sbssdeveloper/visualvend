import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { colors } from '../../Assets/native/colors';
import appStyles from '../../Assets/native/appStyles';
import { NoRecordsIcon } from '../../Assets/native/images';

const NoRecords = ({ isPending = false ,customText}) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {isPending ? <ActivityIndicator color={colors.steelBlue} size={'large'} /> : <>
                <NoRecordsIcon />
                <Text style={[appStyles.subHeaderText, { bottom: 5 }]}>
                   {customText || "coming soon..."} 
                </Text>
            </>
            }
        </View>
    );
};
export default NoRecords;