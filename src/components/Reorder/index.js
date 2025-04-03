import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from "react-native"
import ReorderStack from "./reoderStack"
import CustomSerach from "../../Widgets/native/customsearch"
import Widget from "../../Widgets/native/widget"
import { useState } from "react"
import { colors } from "../../Assets/native/colors"
import { useDebouncing } from "../../Hooks/useDebounce/useDeboucing"
import ProductHeadings from "../../Widgets/native/ProductHeadings"
import useCustomTextData from "../../Hooks/customTextData/useCustomTextData"

const Reorder = () => {

    const [modalStates, setMddalStates] = useState(null);
  const [searchText, setSearchText] = useCustomTextData();

    const [debounceSearch] = useDebouncing(searchText, 1000);

    return (
        <SafeAreaView>
            <View style={[appStyles.mainContainer, { paddingHorizontal: undefined, }]}>
                <CustomSerach searchText={searchText} searchHandler={setSearchText} placeHolderText="Search" style={{ flex: 1 }} />
                <View style={[appStyles.gap_10]}>
                    <Widget
                        setMddalStates={setMddalStates}
                        modalStates={modalStates}
                    />
                </View>
                <ScrollView style={{ backgroundColor: colors.appBackground, marginTop: 12, }}>

                    <View
                        style={[
                            appStyles.mainContainer,
                            { backgroundColor: colors.appBackground },
                        ]}>
                        <View style={[appStyles.pv_10]}>
                            <ProductHeadings heading={"PRODUCT RE-ORDERING"} subHeading={"By Product"} />
                            <ReorderStack />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
export default Reorder


