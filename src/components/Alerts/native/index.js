import React from 'react';
import { SafeAreaView, View, Text, FlatList } from 'react-native';
import roundcontainerstyles from '../../../Widgets/native/roundcontainer/roundcontainerstyles';
import appStyles from '../../../Assets/native/appStyles';
import { BumpAlert, CommsAlert, DoorActivityAlert, ExportUpload, PowerAlert, RefillAlert, RefundAlert, TempAlert, VendingAlert } from '../../../Assets/native/images';
import NoRecords from '../../../Widgets/native/noRecords';
import { colors } from '../../../Assets/native/colors';

const Alerts = ({ navigation }) => {


  const renderItem = ({ item, index }) => {

    return (

      <View style={[roundcontainerstyles.roundBox, { marginVertical: 10, margin: 5, elevation: 2, height: 110 }]}>

        <View style={[appStyles.rowSpaceBetweenAlignCenter, { flex: 1, flexDirection: undefined, justifyContent: "center",gap:5 }]}>

          <item.Icon />

          <Text style={[appStyles.subHeaderText]}>

            {item?.title}

          </Text>

        </View>

      </View>

    )

  }




  return (

    <SafeAreaView>

      <View style={[appStyles.mainContainer, { backgroundColor: colors.appBackground }]}>

        <View style={[appStyles.rowSpaceBetweenAlignCenter, { marginTop: 15 }]}>

          <Text style={[appStyles.subHeaderText]}>

            All Alerts

          </Text>

          <ExportUpload />

        </View>



        {
          AlertArray?.length > 0

            ?

            <FlatList

              data={AlertArray}
              renderItem={renderItem}
              numColumns={2}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            //onEndReached={loadMore}
            //onEndReachedThreshold={0.3}
            // ListFooterComponent={isFetchingNextPage ? renderSpinner : null}
            />

            :

            <NoRecords
              isPending={false}
            />
        }

      </View>

    </SafeAreaView>

  );



};

export default Alerts;


const AlertArray = [
  { title: "Vending Alerts", id: 1, Icon: VendingAlert },
  { title: "Refill Alerts", id: 2, Icon: RefillAlert },
  { title: "Refunded Vends", id: 3, Icon: RefundAlert },
  { title: "Power Issue", id: 4, Icon: PowerAlert },
  { title: "Comms Issues", id: 5, Icon: CommsAlert },
  { title: "Temp Alerts", id: 6, Icon: TempAlert },
  { title: "Door Activity", id: 7, Icon: DoorActivityAlert },
  { title: "Bump In/Out", id: 8, Icon: BumpAlert },


]
