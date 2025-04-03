import { useIsFocused } from '@react-navigation/native';

const useIsScreenFocused = () => {
  const focus = useIsFocused();
  return { focus };
};

export default useIsScreenFocused;
