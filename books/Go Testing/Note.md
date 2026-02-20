> [!PDF|] [[testing-in-go.pdf#page=36&selection=67,0,69,10|testing-in-go, p.36]]
> > Concurrent tests with t.Parallel

> [!PDF|] [[testing-in-go.pdf#page=37&selection=19,0,25,8|testing-in-go, p.37]]
> > Failures: t.Error and t.Errorf

> [!PDF|] [[testing-in-go.pdf#page=38&selection=53,0,55,7|testing-in-go, p.38]]
> > Abandoning the test with t.Fatal
>
> t.Error and t.Errorf won't stop the execution of the test but t.Fatal will

> [!PDF|] [[testing-in-go.pdf#page=39&selection=96,0,98,5|testing-in-go, p.39]]
> > Writing debug output with t.Log

> [!PDF|] [[testing-in-go.pdf#page=41&selection=0,0,6,4|testing-in-go, p.41]]
> > Test flags: -v and -run

> [!PDF|] [[testing-in-go.pdf#page=42&selection=37,0,39,8|testing-in-go, p.42]]
> > Assistants: t.Helper

> [!PDF|] [[testing-in-go.pdf#page=43&selection=53,0,57,9|testing-in-go, p.43]]
> > t.TempDir and t.Cleanup

> [!PDF|] [[testing-in-go.pdf#page=48&selection=0,0,6,8|testing-in-go, p.48]]
> > Comparisons: cmp.Equal and cmp.Diff

> [!PDF|] [[testing-in-go.pdf#page=51&selection=42,0,42,30|testing-in-go, p.51]]
> > Test names should be sentences
>
> For valid and meaning test names

> [!PDF|] [[testing-in-go.pdf#page=66&selection=72,0,72,19|testing-in-go, p.66]]
> > Executable examples
>
> Writing tests without writing them
#### Simulating and handling errors while testing
> [!PDF|] [[testing-in-go.pdf#page=79&selection=85,0,85,17|testing-in-go, p.79]]
> > Simulating errors

> [!PDF|] [[testing-in-go.pdf#page=81&selection=41,0,43,3|testing-in-go, p.81]]
> > Testing that an error is not nil
>
> some useful info about the error package in go

> [!PDF|] [[testing-in-go.pdf#page=83&selection=87,0,87,36|testing-in-go, p.83]]
> > String matching on errors is fragile

> [!PDF|] [[testing-in-go.pdf#page=84&selection=66,0,66,39|testing-in-go, p.84]]
> > Sentinel errors lose useful information

> [!PDF|] [[testing-in-go.pdf#page=86&selection=97,0,99,9|testing-in-go, p.86]]
> > Detecting sentinel errors with errors.Is

> [!PDF|] [[testing-in-go.pdf#page=89&selection=0,0,0,49|testing-in-go, p.89]]
> > Wrapping sentinel errors with dynamic information

> [!PDF|] [[testing-in-go.pdf#page=90&selection=91,0,93,9|testing-in-go, p.90]]
> > Custom error types and errors.As
