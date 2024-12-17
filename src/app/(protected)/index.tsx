import {
  SafeAreaView,
  ScrollView,
} from 'react-native';
import MotionToggle from '~/app/(protected)/_components/MotionSensorToggle';

import LivestreamComponent from '~/app/(protected)/_components/Livestream';
import LatestNotificationsComponent from '~/app/(protected)/_components/LatestNotifications';

export default function HomeSecurityScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">

        <LivestreamComponent></LivestreamComponent>

        <MotionToggle></MotionToggle>

        <LatestNotificationsComponent></LatestNotificationsComponent>
      </ScrollView>
    </SafeAreaView>
  );
}
