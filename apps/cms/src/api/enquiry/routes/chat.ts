/**
 * The website assistant's enquiry: created on the first call, updated after
 * (see the controller's `chat`). Needs the API token's
 * "api::enquiry.enquiry.chat" permission.
 */
export default {
  routes: [
    {
      method: "PUT",
      path: "/enquiries/chat",
      handler: "api::enquiry.enquiry.chat",
    },
  ],
}
