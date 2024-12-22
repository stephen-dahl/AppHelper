import { Chip } from "@mui/material";

interface Props {
  label: string,
  menuItems: { url: string, label: string }[]
	onNavigate: (url: string) => void;
}

export const SecondaryMenu= (props:Props) => {

  const getItems = () => {
    const result:any[] = [];
    props.menuItems.forEach(item => {
      if (item.label === props.label) result.push(<Chip onClick={() => props.onNavigate(item.url)} label={item.label} component="a" variant="filled" clickable style={{backgroundColor:"var(--c1d2)", color:"#FFF", fontSize:16}} />);
      else result.push(<a href="about:blank" onClick={(e) => { e.preventDefault(); props.onNavigate(item.url) }} style={{ color:"#FFF", textDecoration: "none", marginLeft:10, marginRight:10}}>{item.label}</a>);
    });
    return result;
  }

  return (<div id="secondaryMenu">
    {getItems()}
  </div>)
}
