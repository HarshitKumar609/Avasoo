import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AdminAuthState from "./Context/AdminAuthContext/AdminAuthState.jsx";
import StudentAuthState from "./Context/StudentAuthContext/StudentAuthState.jsx";
import AuthResolverState from "./Context/AuthResolverState.jsx";
import RoomState from "./Context/RoomContext/RoomState.jsx";
import AllocationState from "./Context/AllocationContext/AllocationState.jsx";
import NoticeState from "./Context/Notice/NoticeState.jsx";
import ComplaintState from "./Context/Complaint/ComplaintState.jsx";
import EnquiryState from "./Context/Enquiry/EnquiryState.jsx";
import PaymentState from "./Context/PaymentContext/PaymentState.jsx";

createRoot(document.getElementById("root")).render(
  <AdminAuthState>
    <StudentAuthState>
      <AuthResolverState>
        <EnquiryState>
          <RoomState>
            <AllocationState>
              <ComplaintState>
                <NoticeState>
                  <PaymentState>
                    <App />
                  </PaymentState>
                </NoticeState>
              </ComplaintState>
            </AllocationState>
          </RoomState>
        </EnquiryState>
      </AuthResolverState>
    </StudentAuthState>
  </AdminAuthState>,
);
