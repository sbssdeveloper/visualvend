import React, { lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import Dashboard from "../../components/Dashboard/web";
import Payments from "../../components/Payments/web";
import PaymentListing from "../../components/Payments_listing/web";
import ComingSoon from "../../components/ComminSoon/web";
import Login from "../../components/Login/web";
import ForgotPassword from "../../components/ForgetPassword/web";
import PageNotFound from "../../components/PageNotFound/web";
import Error500Page from "../../components/Error500Page/web";
import OuterLayout from "../../components/Layout/web/OuterLayout";
import ScanCode from "../../components/ScanCode/web";
import Snapshot from "../../components/Snapshot/web";
import Machines from "../../components/Machines/web";
import Products from "../../components/Products/web";
import Stock from "../../components/Stock/web";
import Operators from "../../components/Operations/web";
import Marketing from "../../components/Marketing/web";
import VendRun from "../../components/VendRun/web";
import Assets from "../../components/Assets/web";
import Setup from "../../components/Setup/web";
import ProductDetailsOutlet from "../../components/ProductDetails/web";
import MachineProductLayout from "../../components/MachineProductLayout/web";
import ProductReOrder from "../../components/ProductReOrder/web";
import SupplierOrder from "../../components/ProductReOrder/web/SupplierOrder";
import PickList from "../../components/ProductReOrder/web/PickList";
import RecentOrder from "../../components/ProductReOrder/web/RecentOrder";
import PastOrders from "../../components/ProductReOrder/web/PastOrders";
import Suppliers from "../../components/ProductReOrder/web/Suppliers";
import ProductReorderContent from "../../components/ProductReOrder/web/Content";
import SpecificProductDetails from "../../components/MachineProductLayout/web/specificProductDetails";
import RefillProduct from "../../components/Refill/web";
import SalesReport from "../../components/Reports/web/sales-report";
import RefillReport from "../../components/Reports/web/refill";
import StockLevelReport from "../../components/Reports/web/stock-level";
import VendActivityReport from "../../components/Reports/web/vend-activity";
import ExpireyProductReport from "../../components/Reports/web/expiry-product";
import VendErrorReport from "../../components/Reports/web/vend-error";
import ClientFeedbackReport from "../../components/Reports/web/client-feedback";
import MediaAdReport from "../../components/Reports/web/media-ad";
import StaffReport from "../../components/Reports/web/staff";
import ServiceReport from "../../components/Reports/web/service";
import CustomerReport from "../../components/Reports/web/customer";
import EReceiptReport from "../../components/Reports/web/e-receipt";
import GiftVendReport from "../../components/Reports/web/gift-vend";
import PaymentReport from "../../components/Reports/web/payment";
import ScheduleItemsReport from "../../components/Reports/web/schedule-item-report";
import AllAlert from "../../components/Alerts/web/all";
import PaymentAlert from "../../components/Alerts/web/payments";
import OperationAlert from "../../components/Alerts/web/operations";
import AssetsAlert from "../../components/Alerts/web/assets";
import MarketingAlert from "../../components/Alerts/web/marketing";
import StockAlert from "../../components/Alerts/web/stock";
import AddEditCategory from "../../components/Category/web/addCategory";
import PlanoGramList from "../../components/Machines/web/planogramList";
import MachineView from "../../components/Machines/web/machineView";
import UpsertMachine from "../../components/Machines/web/upsert";
import MachinePlanogram from "../../components/Machines/web/machinePlanogram";
import MachineSurcharges from "../../components/Machines/web/MachineSurcharges";
import ResetPlanogram from "../../components/Machines/web/resetPlanogram";
import UploadPlanogram from "../../components/Machines/web/uploadPlanogram";
import EditPlanogram from "../../components/Machines/web/machinePlanogram/EditPlanogram";

const AuthRemover = lazy(() => import("../../components/Provider/web/AuthRemover"));
const AuthProvider = lazy(() => import("../../components/Provider/web/AuthProvider"));
const AuthLayout = lazy(() => import("../../components/Layout/web/AuthLayout"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
    errorElement: <Error500Page />,
    children: [
      {
        path: "home",
        element: <Dashboard />,
        id: "Home",
      },
      {
        path: "payments",
        element: <Outlet />,
        id: "payments",
        children: [
          {
            index: true,
            element: <Payments />,
            id: "Payment",
          },
          {
            path: ":pageType",
            element: <PaymentListing />,
            id: "PaymentListing",
          },
        ],
      },
      {
        path: "scan-code",
        element: <ScanCode />,
        id: "ScanCode",
      },
      {
        path: "alerts",
        element: <Outlet />,
        id: "Alerts",
        children: [
          {
            path: "all",
            element: <AllAlert />,
            id: "all",
          },
          {
            path: "payments",
            element: <PaymentAlert />,
            id: "alert-payments",
          },
          {
            path: "stock",
            element: <StockAlert />,
            id: "alert-stock",
          },
          {
            path: "operations",
            element: <OperationAlert />,
            id: "alert-operations",
          },
          {
            path: "assets",
            element: <AssetsAlert />,
            id: "alert-assets",
          },
          {
            path: "marketing",
            element: <MarketingAlert />,
            id: "alert-marketing",
          },
        ],
      },
      {
        path: "snapshot",
        element: <Snapshot />,
        id: "Snapshot",
      },
      {
        path: "machines",
        element: <Outlet />,
        id: "Machines",
        children: [
          {
            index: true,
            element: <Machines />,
            id: "machine-list",
          },
          {
            path: "planogram-list",
            element: <PlanoGramList />,
            id: "planogram-list",
            children: [
              {
                path: "machine-view",
                element: <MachineView />,
                id: "machine-view",
              },
            ],
          },
          {
            path: "upsert",
            element: <UpsertMachine />,
            id: "upsert",
          },
          {
            path:"machine-surcharges",
            element: <MachineSurcharges />,
            id: "machine-surcharges"
          }, 
          {
            path: "machine-planogram",
            element: <Outlet />,
            id: "machine-planogram",
            children: [
              {
                index: true,
                element: <MachinePlanogram />,
                id: "machine-planogram-view",
              },
              {
                path: "reset-plannogram",
                element: <ResetPlanogram />,
                id: "reset-plannogram",
              },
              {
                path: "upload-plannogram",
                element: <UploadPlanogram />,
                id: "upload-plannogram",
              },
              {
                path: "edit-planogram",
                element: <EditPlanogram />,
                id: "edit-planogram",
              },
            ],
          },
        ],
      },
      { 
        path: "product",
        element: <ComingSoon />,
        id: "Product",
      },
      {
        path: "products",
        element: <Outlet />,
        id: "Products",
        children: [
          {
            index: true,
            element: <Products />,
            id: "All-products",
          },
          {
            path: "add-category",
            element: <AddEditCategory />,
            id: "add-edit-category",
          },
          {
            path: ":productId/:pageType",
            element: <ProductDetailsOutlet />,
            id: "product-details-outlet",
          },
        ],
      },
      {
        path: "stock",
        element: <Stock />,
        id: "Stock",
      },
      {
        path: "product-layout",
        index: true,
        element: <MachineProductLayout />,
        id: "product-layout",
      },
      {
        path: "product-layout/:productId/details",
        index: true,
        element: <SpecificProductDetails />,
        id: "specific-product-details",
      },
      {
        path: "refill",
        index: true,
        element: <RefillProduct />,
        id: "product-refill",
      },
      {
        path: "reorder",
        element: <ProductReOrder />,
        id: "product-reorder",
        children: [
          {
            path: "supplier-order",
            index: true,
            element: <SupplierOrder />,
            id: "supplier-order",
          },
          {
            path: "pick-list",
            index: true,
            element: <PickList />,
            id: "pick-list",
          },
          {
            path: "recent-order",
            index: true,
            element: <RecentOrder />,
            id: "recent-order",
          },
          {
            path: "past-orders",
            index: true,
            element: <PastOrders />,
            id: "past-orders",
          },
          {
            path: "suppliers",
            index: true,
            element: <Suppliers />,
            id: "Product-suppliers",
          },
          {
            path: "content",
            index: true,
            element: <ProductReorderContent />,
            id: "Product-reorder-content",
          },
        ],
      },
      {
        path: "operations",
        element: <Operators />,
        id: "Operations",
      },
      {
        path: "marketing",
        element: <Marketing />,
        id: "Marketing",
      },
      // {
      //   path: "reports",
      //   element: <Reports />,
      //   id: "Reports",
      // },
      {
        path: "vend-run",
        element: <VendRun />,
        id: "Vend-Run",
      },
      {
        path: "assets",
        element: <Assets />,
        id: "Assets",
      },
      {
        path: "setup",
        element: <Setup />,
        id: "Setup",
      },
      {
        path: "report",
        id: "report",
        children: [
          {
            index: true,
            path: "sales",
            element: <SalesReport />,
            id: "sales-report",
          },
          {
            path: "refill",
            element: <RefillReport />,
            id: "refill-report",
          },
          {
            path: "stock-level",
            element: <StockLevelReport />,
            id: "stock-level-report",
          },
          {
            path: "vend-activity",
            element: <VendActivityReport />,
            id: "vend-activity-report",
          },
          {
            path: "expiry-product",
            element: <ExpireyProductReport />,
            id: "expiry-product-report",
          },
          {
            path: "vend-error",
            element: <VendErrorReport />,
            id: "vend-error-report",
          },
          {
            path: "client-fedback",
            element: <ClientFeedbackReport />,
            id: "client-fedback-report",
          },
          {
            path: "media-ad",
            element: <MediaAdReport />,
            id: "media-ad-report",
          },
          {
            path: "staff",
            element: <StaffReport />,
            id: "staff-report",
          },
          {
            path: "service",
            element: <ServiceReport />,
            id: "service-report",
          },
          {
            path: "customer",
            element: <CustomerReport />,
            id: "customer-report",
          },
          {
            path: "e-receipt",
            element: <EReceiptReport />,
            id: "e-receipt-report",
          },
          {
            path: "gift-vend",
            element: <GiftVendReport />,
            id: "gift-vend-report",
          },
          {
            path: "payment",
            element: <PaymentReport />,
            id: "payment-report",
          },
          {
            path: "schedule-report/:type",
            element: <ScheduleItemsReport />,
            id: "schedule-report",
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: (
      <AuthRemover>
        <OuterLayout />
      </AuthRemover>
    ),
    errorElement: <Error500Page />,
    children: [
      {
        index: true,
        element: <Login />,
        id: "Login",
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
        id: "forgot-password",
      },
    ],
  },

  {
    path: "*",
    element: <PageNotFound />,
  },
]);
