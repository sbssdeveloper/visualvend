import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from 'react-native-popup-menu';
import { DownArrowSmallBlack } from '../../Assets/native/images';

const CustomDropDown = ({ listItem, pv, width, bottom, setValues, icon }) => {
    return (
        <>
            <Menu>
                <MenuTrigger
                    customStyles={{
                        optionsWrapper: { padding: 2 },
                        TriggerTouchableComponent: ({ onPress }) => {
                            return (
                                <TouchableOpacity
                                    onPress={onPress}
                                    style={{
                                        padding: pv || 5,
                                        borderRadius: 4,
                                        // marginTop: 25,
                                    }}>
                                    {icon ? icon : <DownArrowSmallBlack />}
                                </TouchableOpacity>
                            );
                        },
                    }}
                />
                <MenuOptions
                    customStyles={{
                        optionsContainer: {
                            width: width || '70%',
                            backgroundColor: '#fff',
                            marginTop: bottom ? undefined : '7%',
                            borderRadius: 8,
                            paddingTop: 20,
                            paddingHorizontal: 10,


                        },
                    }}>
                    <FlatList
                        data={listItem}
                        renderItem={({ item }) => (
                            <MenuOption
                                onSelect={() => {
                                    setValues && setValues({ item });
                                }}
                                style={{
                                    backgroundColor: '#f2f2f2',
                                    borderRadius: 5,
                                    paddingVertical: 8,
                                    marginVertical: 2,
                                }}>
                                <Text style={[appStyles.subHeaderText,
                                { fontSize: 12, textAlign: "center" },
                                ]}>
                                    {item?.keyName}
                                </Text>
                            </MenuOption>
                        )}
                    />
                </MenuOptions>
            </Menu>
        </>
    );
};

export default CustomDropDown;
