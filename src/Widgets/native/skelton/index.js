import { View, Text } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const AppSkelton = ({ length, height, width, extraStyles = {} }) => {


 return (
  <SkeletonPlaceholder >
   <View style={[extraStyles]}>
    {Array.from({ length: length || 5 }).map((_, index) => (
     <SkeletonPlaceholder.Item
      key={index}
      width={width || "100%"}
      height={height || 100}
      borderRadius={10}
      marginBottom={20}
     />
    ))}
   </View>

  </SkeletonPlaceholder>
 )
}

export default AppSkelton