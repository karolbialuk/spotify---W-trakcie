import { React } from "react";
import { useLocation } from "react-router-dom";

const SecondBlockItem = ({ data, type }) => {
  const location = useLocation();
  let description;

  if (
    location.pathname === "/home" ||
    location.pathname.split("/")[1] === "category"
  ) {
    let desc = data?.description.split(" ");

    let index = desc && desc.indexOf("<a");
    desc?.splice(index, index + 1);
    if (desc?.length > 12) {
      desc.splice(12, desc.length);
      desc.push("...");
    }

    description = desc?.join(" ");
  } else if (location.pathname === "/search" && type === "playlist") {
    description = data.owner && "Autor: " + data.owner.display_name;
  } else if (
    (location.pathname === "/search" && type === "album") ||
    (location.pathname.split("/")[1] === "author" && type === "album")
  ) {
    let author = data.artists.slice(0, 4).map((artist) => {
      return artist.name;
    });
    description = new Date(data.release_date).getFullYear() + " " + author;
  } else if (location.pathname === "/search" && type === "show") {
    description = data.publisher;
  } else if (location.pathname === "/search" && type === "episode") {
    const dateString = data.release_date;
    const date = new Date(dateString);

    const day = date.getDate();
    const month = new Intl.DateTimeFormat("pl", { month: "short" }).format(
      date
    );

    const formattedDate = `${day} ${month}`;

    description = (
      <div>
        {formattedDate}
        <span
          dangerouslySetInnerHTML={{
            __html: " &middot; ",
          }}
        />
        {Math.round(data.duration_ms / 60000)} min
      </div>
    );
  }
  // Jeżeli

  // console.log(desc.includes("<a"));

  // if (desc.includes("<a")) {
  //   let index = desc && desc.indexOf("<a");
  //   desc.splice(index, desc.length);
  //   description = desc.join(" ");
  // }

  return (
    <div className="main-second-block__element">
      <div className="main-second-block__element-img">
        <img src={data?.images[0]?.url} />
      </div>
      <div className="main-second-block__element-content">
        <h2>{data?.name}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default SecondBlockItem;
