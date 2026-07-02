export const checkDisplayFrequency = (popupData) => {
  const { displayFrequency, _id } = popupData;
  const storageKey = `popup_${_id}`;

  switch (displayFrequency) {
    case "always":
      return true;

    case "once-per-session":
      return !sessionStorage.getItem(storageKey);

    case "once-per-day":
      const lastShown = localStorage.getItem(storageKey);
      if (!lastShown) return true;
      const dayInMs = 24 * 60 * 60 * 1000;
      return Date.now() - parseInt(lastShown) > dayInMs;

    case "once-ever":
      return !localStorage.getItem(storageKey);

    default:
      return true;
  }
};

export const savePopupDisplay = (popup) => {
  const storageKey = `popup_${popup._id}`;
  const timestamp = Date.now().toString();

  switch (popup.displayFrequency) {
    case "once-per-session":
      sessionStorage.setItem(storageKey, timestamp);
      break;
    case "once-per-day":
    case "once-ever":
      localStorage.setItem(storageKey, timestamp);
      break;
  }
};
