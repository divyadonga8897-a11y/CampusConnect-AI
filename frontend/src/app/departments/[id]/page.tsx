import type { Metadata } from "next";
import DepartmentDetailClient from "@/components/college/DepartmentDetailClient";
import { notFound } from "next/navigation";
import { academicService } from "@/services/academicService";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await academicService.getDepartment(id);
  const dept = res.data;
  if (!dept) return { title: "Department Not Found | CampusConnect AI" };
  return {
    title: `${dept.department_name} | Sri Satya Institute of Engineering and Technology`,
    description: dept.description,
  };
}

export async function generateStaticParams() {
  const res = await academicService.getDepartments();
  const depts = res.data || [];
  return depts.map((d) => ({ id: d.id }));
}

export default async function DepartmentDetailPage({ params }: Props) {
  const { id } = await params;
  const res = await academicService.getDepartment(id);
  const dept = res.data;
  if (!dept) notFound();
  return <DepartmentDetailClient department={dept} />;
}
