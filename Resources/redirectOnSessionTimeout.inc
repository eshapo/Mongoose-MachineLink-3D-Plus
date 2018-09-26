<!--
  Common include to check the session is current and if not redirect to the
  login page, then after logging in redirect back to the referring page.

  Note a redirect on a non-root user can be effected by defining the
  pre-processor symbol "CHECK_ROOT_USER" before including this file.
-->

<!-- <%
// Check the session, if timed out redirect, and pass the referring page as
// an argument. This allows index.html to redirect back to the referring page.
useSession();
if (
#ifdef CHECK_ROOT_USER
    (session["userlevel"] != '0') ||
#endif
    request["SESSION_ID"] != session["sessionid"]) {
  redirect('/index.html?src=' + request["SCRIPT_NAME"]);
  exit(403);
}
%> -->
