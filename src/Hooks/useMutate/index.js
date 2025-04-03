import createUseMutation from "../../Helpers/mutation";
import { login } from "../../components/Login/action";

export const useLoginMutation = createUseMutation(login, "login");
