import { TouchableOpacity, View, Text } from 'react-native';

import { useSelector } from 'react-redux';
import appStyles, { fonts } from '../../Assets/native/appStyles';
import { CalenderIcon, DownArrowBlack, MachineIcon, SmallMa, DownArrowBlackchineIcon, SmallMachineIcon } from '../../Assets/native/images';
import { colors } from '../../Assets/native/colors';
import { sortWordsLength } from '../../Helpers/native';

const Widget = ({ setMddalStates, modalStates, extraModal, modalType }) => {
  const { commonShowingDate, commonMachineName } = useSelector(state => state.filterSlice);
  const widgetHandler = param => setMddalStates(param)

  return (
    <View style={[appStyles.rowSpaceBetweenAlignCenter, appStyles.ph_10, appStyles.pv_10]}>
      <TouchableOpacity
        onPress={() => widgetHandler("selectDay")}
        style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5, padding: 2, }]}>
        <CalenderIcon />
        <Text style={[appStyles.subHeaderText, fonts.semiBold, { color: colors.lightBlack }]}>
          {sortWordsLength(commonShowingDate, 18)}
        </Text>
        <View style={{ top: 2, right: 3 }}>
          <DownArrowBlack height={15} width={15} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => widgetHandler('selectMachineId')}
        style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5, padding: 2, }]}>
        <SmallMachineIcon />
        <Text style={[appStyles.subHeaderText, fonts.semiBold, { color: colors.lightBlack }]}>
          {sortWordsLength(commonMachineName || "", 12)}
        </Text>
        <View style={{ top: 2, right: 2 }}>
          <DownArrowBlack height={15} width={15} />
        </View>
      </TouchableOpacity>

      {
        extraModal &&
        <TouchableOpacity
          onPress={() => widgetHandler(modalType)}
          style={[appStyles.rowSpaceBetweenAlignCenter, { gap: 5, padding: 2, }]}>
          <SmallMachineIcon />
          <Text style={[appStyles.subHeaderText, fonts.semiBold, { color: colors.lightBlack }]}>
            {sortWordsLength(extraModal?.name || "", 8)}
          </Text>
          <View style={{ top: 2, right: 5 }}>
            <DownArrowBlack height={15} width={15} />
          </View>
        </TouchableOpacity>
      }
    </View>

  );

};

export default Widget;