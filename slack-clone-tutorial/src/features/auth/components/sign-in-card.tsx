//注册卡片组件
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { SignFlow } from "../types";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
interface SignInCardProps {
  setState: (state: SignFlow) => void;
}
export const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  //使用convexAuth提供的的方法来注册或登录
  const { signIn } = useAuthActions();
  //使用convexAuth提供的的方法来注册用户(第三方平台)
  const onProviderSignIn = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };
  //使用convexAuth提供的方法来注册用户(邮箱密码)
  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    //第一个参数是登录或注册的方式，第二个参数是表单数据，其中要设置flow字段来分辨‘注册’和‘登录’
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("😱Invalid email or password!");
      })
      .finally(() => {
        setPending(false);
      });
  };
  return (
    <Card className=" w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue.
        </CardDescription>
      </CardHeader>
      {/* 错误提示 */}
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      {/* 表单部分 */}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="email"
            type="email"
            required
          ></Input>
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Pasword"
            type="password"
            required
          ></Input>
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            variant="outline"
            onClick={() => {
              onProviderSignIn("google");
            }}
            size="lg"
            disabled={pending}
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5 "></FcGoogle>
            Continue with Google
          </Button>
          <Button
            className="w-full relative"
            variant="outline"
            onClick={() => {
              onProviderSignIn("github");
            }}
            size="lg"
            disabled={pending}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5 "></FaGithub>
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?
          <span
            onClick={() => setState("signUp")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
