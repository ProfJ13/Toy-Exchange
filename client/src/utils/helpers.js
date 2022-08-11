module.exports = {
  format_date: (timestamp) => {
    const timeDifference = (Date.now() - timestamp) / 60000;
    if (timeDifference) {
      if (timeDifference < 1) {
        return `posted this a few seconds ago`;
      } else if (timeDifference < 60) {
        if (Math.floor(timeDifference) === 1) {
          return `posted this 1 minute ago`;
        }
        return `posted this ${Math.floor(timeDifference)} minutes ago`;
      } else if (timeDifference < 1440) {
        if (Math.floor(timeDifference / 60) === 1) {
          return `posted this 1 hour ago`;
        }
        return `posted this ${Math.floor(timeDifference / 60)} hours ago`;
      } else if (timeDifference < 43200) {
        if (Math.floor(timeDifference / 1440) === 1) {
          return `posted this 1 day ago`;
        }
        return `${Math.floor(timeDifference / 1440)} days ago`;
      } else if (timeDifference < 525600) {
        if (Math.floor(timeDifference / 43200) === 1) {
          return `posted this 1 month ago`;
        }
        return `posted this ${Math.floor(timeDifference / 43200)} months ago`;
      } else {
        const years = Math.floor(timeDifference / 525600);
        const remainderMonths = Math.floor((timeDifference - 525600) / 43200);
        if (years === 1 && remainderMonths === 1) {
          return `posted this 1 year, 1 month ago`;
        } else if (years === 1) {
          return `posted this 1 year, ${remainderMonths} months ago`;
        } else {
          return `posted this ${years} years ago`;
        }
      }
    } else if (timestamp.toLocaleString()) {
      return `posted this on ${timestamp.toLocaleString()}`;
    } else {
      return "";
    }
  },
};
