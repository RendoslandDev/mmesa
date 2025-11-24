const ProgressBar = ({ current, total }) => {
    return (
        <div className="text-right">
            <p className={`text-2xl font-bold ${current === total ? 'text-green-600' : 'text-black'}`}>
                {current}/{total}
            </p>
        </div>
    );
};

export default ProgressBar;