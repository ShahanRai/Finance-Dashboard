import { Bell, User, Moon, Sun, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState, createContext, useContext } from "react";
import { Modal } from "@/components/ui/modal";
import { FormField, SelectField, FormActions } from "@/components/ui/form-elements";
import { FakeDataContext } from "@/pages/Index";

// Export CurrencyContext from here
export const CurrencyContext = createContext({
  currency: "USD",
  setCurrency: (currency: string) => {},
});

export const DashboardHeader = () => {
  const { theme, setTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { currency, setCurrency } = useContext(CurrencyContext);
  const { showFakeData, setShowFakeData } = useContext(FakeDataContext);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    currency: currency,
    pushNotifications: true
  });

  // Notifications
  const notifications = [
    { id: 1, title: "Payment Due", message: "Your credit card payment is due in 3 days", time: "2 hours ago", read: false },
    { id: 2, title: "Investment Update", message: "Your portfolio has gained 2.3% this week", time: "1 day ago", read: true },
    { id: 3, title: "Budget Alert", message: "You've exceeded your dining budget by 15%", time: "2 days ago", read: true }
  ];

  return (
    <>
      <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Dashboard Logo */}
            <img src="/placeholder.svg" alt="Logo" className="w-14 h-14 rounded-lg shadow" onError={e => { e.currentTarget.src = '/favicon.ico'; }} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Financial Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Welcome back, {profileData.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {/* Fake Data Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              aria-label={showFakeData ? "Show Real Data" : "Show Fake Data"}
              onClick={() => setShowFakeData(!showFakeData)}
              title={showFakeData ? "Show Real Data" : "Show Fake Data"}
            >
              {showFakeData ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 relative"
              onClick={() => setIsNotificationsOpen(true)}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </Button>
            {/* Profile */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              onClick={() => setIsProfileOpen(true)}
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      {/* Profile Modal */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Profile Settings"
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{profileData.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{profileData.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              name="name"
              value={profileData.name}
              onChange={(value) => setProfileData({ ...profileData, name: value })}
              required
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={(value) => setProfileData({ ...profileData, email: value })}
              required
            />
            <SelectField
              label="Currency"
              name="currency"
              value={profileData.currency}
              onValueChange={(value) => setProfileData({ ...profileData, currency: value })}
              options={[
                { value: "USD", label: "US Dollar ($)" },
                { value: "INR", label: "Indian Rupee (₹)" }
              ]}
              required
            />
          </div>
          {/* Preferences Section */}
          <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Preferences</h4>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
              <Button
                variant={profileData.pushNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => setProfileData({ ...profileData, pushNotifications: !profileData.pushNotifications })}
              >
                {profileData.pushNotifications ? "On" : "Off"}
              </Button>
            </div>
          </div>
          <FormActions
            onCancel={() => setIsProfileOpen(false)}
            onSubmit={() => {
              setIsProfileOpen(false);
              setCurrency(profileData.currency);
            }}
            submitText="Update Profile"
          />
        </div>
      </Modal>
      {/* Notifications Modal */}
      <Modal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Notifications"
        size="md"
      >
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read
                    ? "border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50"
                    : "border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-gray-100">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </>
  );
};
