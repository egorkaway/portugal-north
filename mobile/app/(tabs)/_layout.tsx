import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useLocale } from '@/i18n/LocaleProvider';
import { useActiveTrip } from '@/lib/useActiveTrip';

const lightColors = Colors.light;

export default function TabLayout() {
  const activeTrip = useActiveTrip();
  const { t } = useLocale();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: lightColors.tint,
        tabBarInactiveTintColor: lightColors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: lightColors.background,
          borderTopColor: '#E2E8EE',
        },
        headerStyle: {
          backgroundColor: lightColors.background,
        },
        headerTintColor: lightColors.tint,
        headerTitleStyle: {
          color: lightColors.text,
        },
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'house.fill', android: 'home', web: 'home' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t('nav.map'),
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'map.fill', android: 'map', web: 'map' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: t('nav.trip'),
          tabBarBadge: activeTrip ? ' ' : undefined,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'tram.fill', android: 'train', web: 'train' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rankings"
        options={{
          title: t('nav.rankings'),
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: t('nav.tickets'),
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'ticket.fill', android: 'confirmation_number', web: 'confirmation_number' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
