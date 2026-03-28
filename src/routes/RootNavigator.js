import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ResourceListPage } from '../pages/ResourceListPage';
import { ReservationCreatePage } from '../pages/ReservationCreatePage';
import { MyReservationsPage } from '../pages/MyReservationsPage';
import { QrCheckPage } from '../pages/QrCheckPage';
import { PenaltyPage } from '../pages/PenaltyPage';
import { StatsPage } from '../pages/StatsPage';
import { AdminPage } from '../pages/AdminPage';
import { MenuPage } from '../pages/MenuPage';
import { MyPage } from '../pages/MyPage';
import { ProfilePage } from '../pages/ProfilePage';
import { MobilePassPage } from '../pages/MobilePassPage';
import { ReservationFormPage } from '../pages/ReservationFormPage';
import { ReservationMapPage } from '../pages/ReservationMapPage';
import { LibraryStatusPage } from '../pages/LibraryStatusPage';
import { SettingsPage } from '../pages/SettingsPage';
import { CheckInPage } from '../pages/CheckInPage';
import { CheckOutPage } from '../pages/CheckOutPage';
import { EndPage } from '../pages/EndPage';
import { WrongPage } from '../pages/WrongPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Resources" component={ResourceListPage} />
      <Tab.Screen name="MyReservations" component={MyReservationsPage} />
      <Tab.Screen name="ProfileStats" component={StatsPage} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginPage} options={{ title: 'KURSU Login' }} />
      <Stack.Screen name="Register" component={RegisterPage} options={{ title: 'Create Account' }} />
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ReservationCreate" component={ReservationCreatePage} options={{ title: 'Create Reservation' }} />
      <Stack.Screen name="ReservationForm" component={ReservationFormPage} options={{ title: 'Koltuk Rezervasyonu' }} />
      <Stack.Screen name="ReservationMap" component={ReservationMapPage} options={{ title: 'Detaylı Bilgi' }} />
      <Stack.Screen name="LibraryStatus" component={LibraryStatusPage} options={{ title: 'Kütüphane Durumu' }} />
      <Stack.Screen name="QrCheck" component={QrCheckPage} options={{ title: 'QR Check In/Out' }} />
      <Stack.Screen name="CheckIn" component={CheckInPage} options={{ title: 'Check-in' }} />
      <Stack.Screen name="CheckOut" component={CheckOutPage} options={{ title: 'Check-out' }} />
      <Stack.Screen name="MobilePass" component={MobilePassPage} options={{ title: 'QR Kimlik' }} />
      <Stack.Screen name="Menu" component={MenuPage} options={{ title: 'Menüler' }} />
      <Stack.Screen name="MyPage" component={MyPage} options={{ title: 'Benim Sayfam' }} />
      <Stack.Screen name="Profile" component={ProfilePage} options={{ title: 'Profil' }} />
      <Stack.Screen name="MyReservationsDetail" component={MyReservationsPage} options={{ title: 'Rezervasyon Bilgisi' }} />
      <Stack.Screen name="StatsDetail" component={StatsPage} options={{ title: 'Kullanıcı İstatistikleri' }} />
      <Stack.Screen name="Settings" component={SettingsPage} options={{ title: 'Ayarlar' }} />
      <Stack.Screen name="Penalty" component={PenaltyPage} options={{ title: 'Penalty and Violations' }} />
      <Stack.Screen name="Admin" component={AdminPage} options={{ title: 'Admin Panel' }} />
      <Stack.Screen name="TheEnd" component={EndPage} options={{ title: 'The End' }} />
      <Stack.Screen name="WrongPage" component={WrongPage} options={{ title: 'Wrong Page' }} />
    </Stack.Navigator>
  );
}
