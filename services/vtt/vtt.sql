CREATE TABLE public.vtt (
	id uuid NOT NULL DEFAULT gen_random_uuid(),
	transcript jsonb NOT NULL DEFAULT '{}'::jsonb,
	CONSTRAINT vtt_pk PRIMARY KEY (id),
	CONSTRAINT vtt_fk FOREIGN KEY (id) REFERENCES public."content"(id)
);
