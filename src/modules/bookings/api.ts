import { api, type ApiResponse } from "@/lib/api";

type RequestOtpArgs = {
  email: string;
};
type VerifyOtpArgs = RequestOtpArgs & {
  code: string;
};
export async function requestOtp({ email }: RequestOtpArgs): Promise<boolean> {
  return api
    .get<ApiResponse<unknown>>("/otp", { params: { email } })
    .then((res) => {
      return res.data.success;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

export async function verifyOtp({
  email,
  code,
}: VerifyOtpArgs): Promise<boolean> {
  return api
    .post<ApiResponse<string>>("/otp", { email: email, code: code })
    .then((res) => {
      return res.data.success;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}
