import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import PageTitle from "@/components/PageTitle";
import ReviewForm from "@/components/ReviewForm";

export default function NewReview() {
  return (
    <DashboardLayout>
      <DashboardContainer>
        <div>
          <PageTitle title="Buat review" />
          <ReviewForm />
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
