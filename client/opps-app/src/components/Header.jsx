// import SellIcon from '@mui/icons-material/Sell';
// import { FaTags } from "react-icons/fa";
import { FaBullseye } from "react-icons/fa";


export default function Header() {
  return (
    <header>
      <h1>
        <FaBullseye className="title-icon" viewBox='0 0 496 512' /> <span className="title">Opportunities</span>
      </h1>
    </header>
  );
} // Header()

