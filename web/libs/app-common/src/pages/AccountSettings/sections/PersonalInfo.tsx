import { type FormEventHandler, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Button, InputFile, ToastType, useToast, Userpic } from "@cynaps/ui";
import { getApiInstance } from "@cynaps/core";
import styles from "../AccountSettings.module.scss";
import { useAuth } from "@cynaps/core/providers/AuthProvider";
import { atomWithMutation } from "jotai-tanstack-query";
import { useAtomValue } from "jotai";
import { Input } from "apps/cynaps/src/components/Form/Elements";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const updateUserAvatarAtom = atomWithMutation(() => ({
  mutationKey: ["update-user-avatar"],
  async mutationFn({
    userId,
    body,
    isDelete,
  }: { userId: number; body: FormData; isDelete?: never } | { userId: number; isDelete: true; body?: never }) {
    const api = getApiInstance();
    const method = isDelete ? "deleteUserAvatar" : "updateUserAvatar";
    const response = await api.invoke<{ detail: string; avatar?: string }>(
      method,
      {
        pk: userId,
      },
      {
        body,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  },
}));


export const PersonalInfo = () => {
  const toast = useToast();
  const { user, refetch: refetchUser, isLoading: userInProgress, update: updateUser } = useAuth();
  const updateUserAvatar = useAtomValue(updateUserAvatarAtom);
  const [isInProgress, setIsInProgress] = useState(false);
  const [fname, setFname] = useState(user?.first_name ?? "");
  const [lname, setLname] = useState(user?.last_name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const avatarRef = useRef<HTMLInputElement>();
  
  const fileChangeHandler: FormEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      if (!user) return;

      const input = e.currentTarget as HTMLInputElement;
      const body = new FormData();
      body.append("avatar", input.files?.[0] ?? "");
      const response = await updateUserAvatar.mutateAsync({
        body,
        userId: user.id,
      });

      console.log("Avatar upload response:", response);

      if (!response?.$meta?.ok) {
        toast?.show({ message: (response as any)?.response?.detail ?? "Error updating avatar", type: ToastType.error });
      } else {
        toast?.show({ message: "Avatar updated successfully", type: ToastType.info });
        // Set local avatar URL immediately from response for instant UI update
        const newAvatarUrl = (response as any).avatar;
        console.log("New avatar URL from response:", newAvatarUrl);
        if (newAvatarUrl) {
          setLocalAvatarUrl(newAvatarUrl);
        }
        refetchUser();
      }
      input.value = "";
    },
    [user?.id, refetchUser, toast, updateUserAvatar],
  );

  const deleteUserAvatar = async () => {
    if (!user) return;
    await updateUserAvatar.mutateAsync({ userId: user.id, isDelete: true });
    toast?.show({ message: "Avatar removed", type: ToastType.info });
    setLocalAvatarUrl(null);
    refetchUser();
  };

  const userFormSubmitHandler: FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (!user) return;
      const body = new FormData(e.currentTarget as HTMLFormElement);
      const json = Object.fromEntries(body.entries());
      const response = await updateUser(json);

      refetchUser();
      if (!response) {
        toast?.show({ message: "Error updating user", type: ToastType.error });
      } else {
        toast?.show({ message: "Profile updated successfully", type: ToastType.info });
      }
    },
    [user?.id, updateUser, refetchUser, toast],
  );

  const passwordSubmitHandler: FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault();
      
      if (newPassword !== confirmPassword) {
        toast?.show({ message: "New passwords do not match", type: ToastType.error });
        return;
      }

      if (newPassword.length < 8) {
        toast?.show({ message: "Password must be at least 8 characters long", type: ToastType.error });
        return;
      }

      setIsChangingPassword(true);
      const api = getApiInstance();
      
      try {
        const response = await api.invoke<{ success: string; error?: string }>(
          "changePassword",
          {},
          {
            body: {
              old_password: oldPassword,
              new_password: newPassword,
            },
          },
        );

        if (response?.$meta?.ok) {
          toast?.show({ message: "Password changed successfully", type: ToastType.info });
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          toast?.show({ 
            message: (response as any)?.response?.error || (response as any)?.response?.detail || "Error changing password", 
            type: ToastType.error 
          });
        }
      } catch (err) {
        toast?.show({ message: "An unexpected error occurred", type: ToastType.error });
      } finally {
        setIsChangingPassword(false);
      }
    },
    [oldPassword, newPassword, confirmPassword, toast],
  );

  useEffect(() => {
    setIsInProgress(userInProgress);
  }, [userInProgress]);

  useEffect(() => {
    setFname(user?.first_name ?? "");
    setLname(user?.last_name ?? "");
    setPhone(user?.phone ?? "");
  }, [user]);

  // Use local avatar URL if set (from recent upload), otherwise fall back to user's avatar
  const displayAvatarUrl = (localAvatarUrl ?? user?.avatar ?? undefined) as string | undefined;

  return (
    <div className={styles.section} id="personal-info">
      <div className={styles.sectionContent}>
        {/* Avatar Section */}
        <div 
          className="flex items-center gap-6 p-6"
          style={{ 
            background: 'rgba(139, 92, 246, 0.05)', 
            border: '1px solid rgba(139, 92, 246, 0.15)' 
          }}
        >
          <div className="relative">
            <Userpic 
              user={user} 
              src={displayAvatarUrl}
              isInProgress={userInProgress} 
              size={96} 
              style={{ 
                flex: "none",
                border: '2px solid #1f1f1f',
              }} 
            />
            <div 
              className="absolute -bottom-1 -right-1 w-8 h-8 flex items-center justify-center"
              style={{ 
                background: '#8b5cf6',
                cursor: 'pointer',
              }}
              onClick={() => avatarRef.current?.click()}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ width: 16, height: 16, color: '#fff' }}
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#fff', margin: 0 }}>
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-sm" style={{ color: '#6b7280', fontFamily: 'monospace', margin: '4px 0 0 0' }}>
                {user?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <form className="hidden">
                <InputFile
                  name="avatar"
                  onChange={fileChangeHandler}
                  accept="image/png, image/jpeg, image/jpg"
                  ref={avatarRef}
                />
              </form>
              <Button 
                variant="neutral" 
                look="outlined" 
                size="small"
                onClick={() => avatarRef.current?.click()}
                style={{ 
                  borderRadius: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontSize: '11px',
                }}
              >
                Change Avatar
              </Button>
              {user?.avatar && (
                <Button 
                  variant="negative" 
                  look="outlined" 
                  size="small" 
                  onClick={deleteUserAvatar}
                  style={{ 
                    borderRadius: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '11px',
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={userFormSubmitHandler} className={styles.sectionContent}>
          <div 
            className="grid gap-6"
            style={{ 
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Input
              label="First Name"
              value={fname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFname(e.target.value)}
              name="first_name"
              placeholder="Enter first name"
              className="w-full"
            />
            <Input
              label="Last Name"
              value={lname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLname(e.target.value)}
              name="last_name"
              placeholder="Enter last name"
              className="w-full"
            />
          </div>
          
          <div 
            className="grid gap-6 mt-6"
            style={{ 
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Input
              label="Email Address"
              type="email"
              readOnly={true}
              value={user?.email ?? ""}
              style={{ opacity: 0.6 }}
              className="w-full"
            />
            <Input
              label="Phone Number"
              type="tel"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              value={phone}
              name="phone"
              placeholder="Enter phone number"
              className="w-full"
            />
          </div>

          <div className={clsx(styles.flexRow, styles.flexEnd)} style={{ marginTop: '1rem' }}>
            <Button 
              waiting={isInProgress}
              style={{ 
                background: '#e8e4d9',
                color: '#000',
                borderRadius: 0,
                padding: '14px 32px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
              }}
            >
              Save Changes
            </Button>
          </div>
        </form>

        {/* Security Section */}
        <div 
          className="mt-12 pt-12 border-t border-gray-900"
        >
          <div className="flex items-start gap-4 mb-8">
            <div className="flex flex-col items-start">
              <div className="w-4 h-[2px] bg-gray-600" />
              <div className="w-[2px] h-4 bg-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Security</h2>
          </div>

          <form onSubmit={passwordSubmitHandler} className="space-y-8">
            <div className="max-w-md space-y-6">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 bottom-[12px] text-gray-400 hover:text-white transition-colors"
                >
                  {showOldPassword ? <EyeInvisibleOutlined {...({} as any)} /> : <EyeOutlined {...({} as any)} />}
                </button>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 bottom-[12px] text-gray-400 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeInvisibleOutlined {...({} as any)} /> : <EyeOutlined {...({} as any)} />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 bottom-[12px] text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeInvisibleOutlined {...({} as any)} /> : <EyeOutlined {...({} as any)} />}
                  </button>
                </div>
              </div>

              {newPassword && confirmPassword && (
                <div className={clsx("text-xs font-medium uppercase tracking-wider", newPassword === confirmPassword ? "text-green-500" : "text-red-500")}>
                  {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </div>
              )}

              <div className="pt-2">
                <Button 
                  waiting={isChangingPassword}
                  disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8}
                  style={{ 
                    background: 'transparent',
                    color: '#fff',
                    borderRadius: 0,
                    padding: '12px 24px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: '1px solid #333',
                    opacity: (!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8) ? 0.3 : 1,
                  }}
                >
                  Change Password
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

