import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to staking page as the main focus
  redirect('/staking')
}

