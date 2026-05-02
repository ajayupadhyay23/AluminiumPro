import { redirect } from "next/navigation";

export default function ProductsPage() {
  // Redirect the generic products page to the home page since we only want users to browse via specific categories
  redirect("/");
}
