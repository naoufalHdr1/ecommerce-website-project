const Title = ({ title, description }) => {
  return (
    <div className="text-center mb-3 mt-5">
      <h1 className="section-title">{title}</h1>
      <p 
        className="section-description text-muted px-2"
        dangerouslySetInnerHTML={{ __html: description }}>
      </p>
    </div>
  );
}

export default Title;
