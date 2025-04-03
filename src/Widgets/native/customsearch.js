import { View, TextInput } from 'react-native'
import React from 'react'
import appStyles from '../../Assets/native/appStyles';
import { SearchIcon } from '../../Assets/native/images';
import { defaultFunction } from '../../Helpers/constant';

const CustomSerach = ({ searchText, searchHandler = defaultFunction, placeHolderText, style }) => {

  return (

    <View style={[appStyles.textInputView,{marginVertical:5}]}>

      <SearchIcon height={16} width={16} />

      <TextInput
        placeholder={placeHolderText}
        onChangeText={text => searchHandler(text)}
        onBlur={() => null}
        keyboardType="default"
        maxLength={20}
        value={searchText}
        placeholderTextColor={'#999999'}
        style={[appStyles.textInput, style]}
        returnKeyType="done"
      />

    </View>
  );
}

export default CustomSerach