function showNotification(activity, address) {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      title: "Alarmă Activitate",
      body: `Este timpul pentru: ${activity}`,
      address,
    });
  } else {
    console.warn("Service Worker not available for notifications");
  }
}

self.addEventListener("message", (event) => {
  if (event.data.action === "openGoogleMaps") {
    fetch("/open-maps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: event.data.address }),
    })
      .then((response) => response.json())
      .then((data) => {
        client.openWindow(data.url); // Open Google Maps URL in a new window/tab
      })
      .catch((error) =>
        console.error("Error fetching Google Maps URL:", error)
      );
  }
});
