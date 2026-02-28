import chroma from "chroma-js";
import { type CSSProperties, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isDefined, userDisplayName } from "@cynaps/core/lib/utils/helpers";
import { Tooltip } from "@cynaps/ui";
import styles from "./Userpic.module.scss";
import clsx from "clsx";

type UserpicProps = {
  badge?: Record<string, any> | null;
  className?: string;
  faded?: boolean;
  showUsernameTooltip?: boolean;
  showUsername?: boolean;
  size?: number;
  src?: string;
  style?: CSSProperties;
  user?: any;
  username?: string;
  children?: any;
  addCount?: string;
  useRandomBackground?: boolean;
  isInProgress?: boolean;
};

const FALLBACK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export const Userpic = forwardRef(
  (
    {
      badge = null,
      className,
      faded = false,
      showUsernameTooltip = false,
      showUsername = false,
      size,
      src,
      style = {},
      addCount,
      user,
      username,
      useRandomBackground = true,
      children,
      isInProgress = false,
      ...rest
    }: UserpicProps,
    ref,
  ) => {
    // src prop takes precedence over user.avatar when explicitly provided
    const propsSrc = src ?? user?.avatar;
    const imgRef = useRef();
    const userRef = useRef(user);
    const [finalSrc, setFinalSrc] = useState(propsSrc);
    const [imgVisible, setImgVisible] = useState(false);
    const [nameVisible, setNameVisible] = useState(true);

    // Debug logging
    useEffect(() => {
      console.log("Userpic: src prop =", src);
      console.log("Userpic: user?.avatar =", user?.avatar);
      console.log("Userpic: propsSrc =", propsSrc);
      console.log("Userpic: finalSrc =", finalSrc);
    }, [src, user?.avatar, propsSrc, finalSrc]);

    // Update finalSrc when propsSrc changes
    useEffect(() => {
      if (isInProgress) {
        setFinalSrc(null);
        setImgVisible(false);
        setNameVisible(true);
      } else {
        // Always update when propsSrc changes
        setFinalSrc(propsSrc);
        setImgVisible(false);
        setNameVisible(true);
      }
    }, [propsSrc, isInProgress]);

    if (size) {
      style = Object.assign({ width: size, height: size, fontSize: size * 0.4 }, style ?? {});
    }

    const displayName = useMemo(() => {
      return userDisplayName(user ?? userRef.current);
    }, [user]);

    const background = useMemo(() => {
      const curUser = user ?? userRef.current;

      if (isDefined(curUser?.id)) {
        const color =
          localStorage.getItem(`userpic-color-${curUser.id}`) ?? chroma.average([chroma.random(), "#cfcfcf"]).css();

        localStorage.setItem(`userpic-color-${curUser.id}`, color);
        return color;
      }

      return null;
    }, [user, useRandomBackground]);

    const textColor = useMemo(() => {
      if (background) {
        const contrast = chroma.contrast(background, "#fff");

        return contrast >= 4.5 ? "#fff" : "#000";
      }

      return null;
    }, [background]);

    const onImageLoaded = useCallback(() => {
      setImgVisible(true);
      if (finalSrc !== FALLBACK_IMAGE) setNameVisible(false);
    }, [finalSrc]);

    const stylesheet = { ...(style ?? {}), background, color: textColor };

    const renderName = () => {
      let name = "";

      if (addCount) {
        name = addCount;
      } else if (nameVisible) {
        name = displayName?.slice(0, 2).toUpperCase();
      }

      return (
        <span className={styles.username} style={style}>
          {name}
        </span>
      );
    };

    const classNameList: Record<string, any> = {};
    if (className) {
      className
        .toString()
        .split(" ")
        .forEach((c) => {
          classNameList[c] = true;
        });
    }

    const userpic = (
      <div className="flex items-center gap-2">
        <div
          ref={ref}
          data-testid="userpic"
          className={clsx(styles.userpic, { [styles.faded]: faded, ...classNameList })}
          style={stylesheet}
          {...rest}
        >
          {children ? (
            children
          ) : (
            <>
              <img
                key={finalSrc}
                className={clsx(styles.avatar, { [styles.faded]: faded })}
                ref={imgRef}
                src={finalSrc}
                alt={(displayName ?? "").toUpperCase()}
                style={{ opacity: imgVisible ? (faded ? 0.3 : 1) : 0 }}
                onLoad={onImageLoaded}
                onError={() => setFinalSrc(FALLBACK_IMAGE)}
              />
              {renderName()}
            </>
          )}
          {badge &&
            Object.entries(badge).map(([align, content], i) => {
              return (
                <div key={`badge-${i}`} className={clsx(styles.badge, { [styles[align]]: true })}>
                  {content}
                </div>
              );
            })}
        </div>

        {showUsername && <span className="text-sm text-gray-500 line-clamp-1">{displayName}</span>}
      </div>
    );

    const userFullName = useMemo(() => {
      const curUser = user ?? userRef.current;

      if (!curUser) return username;
      if (curUser.displayName) return curUser.displayName;
      if (curUser.first_name || curUser.last_name) {
        return `${curUser.first_name ?? ""} ${curUser.last_name ?? ""}`.trim();
      }
      if (curUser.email) {
        return curUser.email;
      }
      return username;
    }, [user, username]);

    return showUsernameTooltip && userFullName ? <Tooltip title={userFullName}>{userpic}</Tooltip> : userpic;
  },
);

Userpic.displayName = "Userpic";

