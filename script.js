document.addEventListener("DOMContentLoaded", (event) => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  if (navigator.serviceWorker) {
    navigator.serviceWorker.register("sw.js").then(() => {
      console.log("Service Worker registered!");
    });
  }
});

function addActivity() {
  const activity = document.getElementById("activity").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const address = document.getElementById("address").value;

  if (activity && date && time && address) {
    const activityList = document.getElementById("activityList");
    const activityItem = document.createElement("div");
    activityItem.classList.add("activity-item");

    const icon = getIconForActivity(activity);
    activityItem.appendChild(icon);

    activityItem.innerHTML += `<span>${activity} - ${date} ${time}</span>`;
    activityList.appendChild(activityItem);

    const activityDateTime = new Date(`${date}T${time}:00`);
    scheduleAlarm(activity, activityDateTime, address);
  } else {
    alert("Te rog completează toate câmpurile!");
  }
}

function getIconForActivity(activity) {
  switch (activity.toLowerCase()) {
    case "sport":
      return createIcon("fas fa-futbol");
    case "muzică":
      return createIcon("fas fa-music");
    default:
      return createIcon("far fa-calendar-alt");
  }
}

function createIcon(iconClass) {
  const icon = document.createElement("i");
  icon.className = iconClass;
  return icon;
}

function scheduleAlarm(activity, dateTime, address) {
  const now = new Date();
  const timeToAlarm = dateTime - now;

  if (timeToAlarm > 0) {
    setTimeout(() => {
      showNotification(activity, address);
    }, timeToAlarm);
  }
}

function showNotification(activity, address) {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      title: "Alarmă Activitate",
      body: `Este timpul pentru: ${activity}`,
      address,
    });
  } else {
    console.warn("Service Worker not available for notifications");
    // Handle notification display without actions (optional)
  }
}
