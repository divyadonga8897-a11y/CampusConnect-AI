import type { Metadata } from "next";
import CourseDetailClient from "@/components/courses/CourseDetailClient";
import { notFound } from "next/navigation";
import { academicService } from "@/services/academicService";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await academicService.getCourse(id);
  const course = res.data;
  if (!course) return { title: "Course Not Found | CampusConnect AI" };
  return {
    title: `${course.course_name} | Sri Satya Institute of Engineering and Technology`,
    description: `Explore B.Tech ${course.course_name} at SSIET. Learn about eligibility criteria, transparent fee structures, academic features, and career opportunities.`,
  };
}

export async function generateStaticParams() {
  const res = await academicService.getCourses();
  const courses = res.data || [];
  return courses.map((c) => ({ id: c.id }));
}

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;
  const res = await academicService.getCourse(id);
  const course = res.data;
  if (!course) notFound();
  return <CourseDetailClient course={course} />;
}
