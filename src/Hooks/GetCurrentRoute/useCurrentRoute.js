import { useNavigationState } from '@react-navigation/native';

const useCurrentRoute = () => {
 return useNavigationState((state) => state?.routes[state?.index]);
};
export default useCurrentRoute
