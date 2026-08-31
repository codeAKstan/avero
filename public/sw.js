// AVERO ACADEMY - Web Push Service Worker
self.addEventListener("push", function (event) {
  let data = {
    title: "🔥 AVERO ACADEMY Study Prompt",
    body: "Time for today's practice! Keep your active retention streak going.",
    icon: "/images/email-logo.jpeg",
    badge: "/icon.png",
    url: "/dashboard",
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/images/email-logo.jpeg",
    badge: data.badge || "/icon.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/dashboard",
    },
    actions: [
      { action: "explore", title: "📚 Start Practice" },
      { action: "close", title: "Close" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "close") return;

  const targetUrl = (event.notification.data && event.notification.data.url) || "/dashboard";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
