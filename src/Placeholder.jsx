const Placeholder = ({ done }) => {
  return (
    <div className={`Placeholder ${done ? "Placholder-done" : ""}`}>
      click or hold
    </div>
  );
};

export default Placeholder;
