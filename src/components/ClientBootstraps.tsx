import { AppUpdateBootstrap } from "@/components/AppUpdateBootstrap";
import { ActiveTripBootstrap } from "@/components/ActiveTripBootstrap";
import { PostHogPageView } from "@/components/PostHogPageView";
import { PwaInstallListener } from "@/components/PwaInstallListener";
import { PwaPermissionsPrompt } from "@/components/PwaPermissionsPrompt";
import { VoteSyncBootstrap } from "@/components/VoteSyncBootstrap";
import { VoteSyncNotice } from "@/components/VoteSyncNotice";
import { WebMcpBridge } from "@/components/WebMcpBridge";

/** Non-critical client services loaded after first paint. */
export default function ClientBootstraps() {
  return (
    <>
      <AppUpdateBootstrap />
      <PostHogPageView />
      <PwaInstallListener />
      <PwaPermissionsPrompt />
      <VoteSyncBootstrap />
      <ActiveTripBootstrap />
      <VoteSyncNotice />
      <WebMcpBridge />
    </>
  );
}
