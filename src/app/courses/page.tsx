import type { Metadata } from "next";
import CoursesClient from "@/components/courses/CoursesClient";

export const metadata: Metadata = {
  title: "Engineering Courses | Sri Satya Institute of Engineering and Technology",
  description:
    "Explore engineering programs, departments, fees, eligibility and career opportunities.",
};

export default function CoursesPage() {
  return <CoursesClient />;
}
